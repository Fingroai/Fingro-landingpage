import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabase';

export default function CrearOferta() {
  const router = useRouter();
  const { id } = router.query;
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bancoInfo, setBancoInfo] = useState(null);
  
  // Estado para los campos del formulario
  const [oferta, setOferta] = useState({
    monto: 0,
    tasa: 0,
    plazo: 36,
    cuota_mensual: 0,
    comision: 0,
    requisitos: '',
    validez: 15,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/banco/login');
        return;
      }
      
      // Obtener información del banco
      const { data: bancoData, error: bancoError } = await supabase
        .from('bancos')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      if (bancoError || !bancoData) {
        await supabase.auth.signOut();
        router.push('/banco/login');
        return;
      }
      
      setBancoInfo(bancoData);
      
      if (id) {
        cargarSolicitud(id);
      }
    };
    
    checkAuth();
  }, [id]);

  useEffect(() => {
    if (oferta.monto > 0 && oferta.tasa > 0 && oferta.plazo > 0) {
      calcularCuotaMensual();
    }
  }, [oferta.monto, oferta.tasa, oferta.plazo]);

  const cargarSolicitud = async (solicitudId) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('id', solicitudId)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('Solicitud no encontrada');
      }
      
      setSolicitud(data);
      
      // Pre-llenar el monto de la oferta con el monto solicitado
      setOferta(prev => ({
        ...prev,
        monto: data.monto_solicitado
      }));
    } catch (error) {
      console.error('Error al cargar la solicitud:', error);
      setError(error.message || 'Error al cargar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const calcularCuotaMensual = () => {
    // Fórmula para calcular la cuota mensual de un préstamo
    const tasaMensual = oferta.tasa / 100 / 12;
    const plazoMeses = oferta.plazo;
    const monto = oferta.monto;
    
    // Fórmula: P = monto * (tasaMensual * (1 + tasaMensual)^plazoMeses) / ((1 + tasaMensual)^plazoMeses - 1)
    const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1);
    
    setOferta(prev => ({
      ...prev,
      cuota_mensual: Math.round(cuota * 100) / 100
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'requisitos') {
      setOferta(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setOferta(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      if (!bancoInfo) {
        throw new Error('Información del banco no disponible');
      }
      
      // Preparar datos de la oferta
      const ofertaData = {
        solicitud_id: solicitud.id,
        banco_id: bancoInfo.id,
        banco_nombre: bancoInfo.nombre,
        banco_logo: bancoInfo.logo || null,
        monto: oferta.monto,
        tasa: oferta.tasa,
        plazo: oferta.plazo,
        cuota_mensual: oferta.cuota_mensual,
        comision: oferta.comision,
        requisitos: oferta.requisitos.split('\\n'),
        validez_dias: oferta.validez,
        estado: 'pendiente',
        created_at: new Date(),
      };
      
      // Guardar oferta en Supabase
      const { data, error } = await supabase
        .from('ofertas')
        .insert([ofertaData])
        .select();
      
      if (error) throw error;
      
      // Actualizar el estado de la solicitud
      await supabase
        .from('solicitudes')
        .update({ tiene_ofertas: true })
        .eq('id', solicitud.id);
      
      alert('Oferta creada con éxito');
      router.push('/banco');
    } catch (error) {
      console.error('Error al crear oferta:', error);
      setError(error.message || 'Error al crear la oferta');
    } finally {
      setSubmitting(false);
    }
  };

  const formatearMoneda = (monto) => {
    if (monto === undefined || monto === null) return 'No disponible';
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(monto);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => router.push('/banco')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Volver al panel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Crear Oferta | Fingro</title>
        <meta name="description" content="Crear oferta de crédito para un cliente" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Oferta</h1>
              <p className="mt-1 text-sm text-gray-600">
                Crea una oferta personalizada para {solicitud.nombre} {solicitud.apellido}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => router.push(`/banco/solicitud/${id}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Volver a la solicitud
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Resumen de la solicitud
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {solicitud.nombre} {solicitud.apellido}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Monto solicitado</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatearMoneda(solicitud.monto_solicitado)}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Propósito</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {solicitud.proposito}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Score</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {solicitud.score || 'No disponible'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Detalles de la oferta
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Completa los detalles de la oferta que deseas enviar al cliente
              </p>
            </div>
            <div className="border-t border-gray-200">
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
                      Monto a ofrecer (Q)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="monto"
                        id="monto"
                        min="1000"
                        step="1000"
                        value={oferta.monto}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="tasa" className="block text-sm font-medium text-gray-700">
                      Tasa de interés anual (%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="tasa"
                        id="tasa"
                        min="1"
                        max="100"
                        step="0.1"
                        value={oferta.tasa}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="plazo" className="block text-sm font-medium text-gray-700">
                      Plazo (meses)
                    </label>
                    <div className="mt-1">
                      <select
                        id="plazo"
                        name="plazo"
                        value={oferta.plazo}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="12">12 meses</option>
                        <option value="24">24 meses</option>
                        <option value="36">36 meses</option>
                        <option value="48">48 meses</option>
                        <option value="60">60 meses</option>
                        <option value="72">72 meses</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="cuota_mensual" className="block text-sm font-medium text-gray-700">
                      Cuota mensual estimada (Q)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="cuota_mensual"
                        id="cuota_mensual"
                        value={oferta.cuota_mensual}
                        readOnly
                        className="bg-gray-100 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="comision" className="block text-sm font-medium text-gray-700">
                      Comisión por apertura (%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="comision"
                        id="comision"
                        min="0"
                        max="10"
                        step="0.1"
                        value={oferta.comision}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="validez" className="block text-sm font-medium text-gray-700">
                      Validez de la oferta (días)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="validez"
                        id="validez"
                        min="1"
                        max="30"
                        value={oferta.validez}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="requisitos" className="block text-sm font-medium text-gray-700">
                      Requisitos (uno por línea)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="requisitos"
                        name="requisitos"
                        rows={4}
                        value={oferta.requisitos}
                        onChange={handleChange}
                        placeholder="Ej: Constancia laboral&#10;Referencias personales&#10;Estado de cuenta"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Escribe cada requisito en una línea nueva.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push(`/banco/solicitud/${id}`)}
                    className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      submitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? 'Enviando...' : 'Crear oferta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
