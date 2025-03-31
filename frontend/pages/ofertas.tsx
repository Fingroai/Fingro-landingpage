import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiCheck, FiInfo, FiAlertCircle, FiDownload } from 'react-icons/fi';
import { obtenerOfertasPorSolicitud, aceptarOferta } from '../services/ofertaService';
import { supabase } from '../lib/supabase';

// Tipo para las ofertas
type Oferta = {
  id: string;
  banco_nombre: string;
  banco_logo: string;
  monto: number;
  tasa: number;
  plazo: number;
  cuota_mensual: number;
  comision: number;
  requisitos: string[];
  validez_dias: number;
  created_at: string;
  estado: string;
  solicitud_id: string;
};

export default function Ofertas() {
  const router = useRouter();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOferta, setSelectedOferta] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Cargar ofertas reales desde Supabase
  useEffect(() => {
    const cargarOfertas = async () => {
      try {
        console.log('Iniciando carga de ofertas...');
        // Obtener el ID de la solicitud del usuario actual
        const { data: { session } } = await supabase.auth.getSession();
        
        // Si no hay sesión, redirigir a la página de acceso
        if (!session) {
          console.log('Usuario no autenticado, redirigiendo a página de acceso');
          router.push('/acceso');
          return;
        }
        
        console.log('Usuario autenticado:', session.user.email);
        
        // Buscar solicitudes asociadas al correo electrónico del usuario
        const { data: solicitudes, error: errorSolicitudes } = await supabase
          .from('solicitudes')
          .select('id, correo')
          .eq('correo', session.user.email)
          .order('created_at', { ascending: false });
        
        if (errorSolicitudes) {
          console.error('Error al buscar solicitudes:', errorSolicitudes);
          return;
        }
        
        console.log('Solicitudes encontradas:', solicitudes?.length || 0);
        
        if (!solicitudes || solicitudes.length === 0) {
          console.log('No se encontraron solicitudes para este usuario');
          return;
        }
        
        // Obtener la solicitud más reciente
        const solicitudId = solicitudes[0].id;
        console.log('Usando solicitud más reciente:', solicitudId);
        
        if (solicitudId) {
          console.log('Buscando ofertas para solicitud:', solicitudId);
          const { data, error } = await obtenerOfertasPorSolicitud(solicitudId);
          
          if (error) throw error;
          
          console.log('Ofertas obtenidas:', data);
          
          if (data && data.length > 0) {
            console.log('Estableciendo ofertas en el estado');
            setOfertas(data);
          } else {
            console.log('No se encontraron ofertas para esta solicitud');
          }
        }
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarOfertas();
  }, []);

  const handleSelectOferta = (id: string) => {
    setSelectedOferta(id);
    setShowConfirmModal(true);
  };

  const handleConfirmSelection = async () => {
    if (!selectedOferta) return;
    
    try {
      // Obtener la oferta seleccionada
      const ofertaSeleccionada = ofertas.find(oferta => oferta.id === selectedOferta);
      
      if (!ofertaSeleccionada) {
        throw new Error('Oferta no encontrada');
      }
      
      // Aceptar la oferta en Supabase
      const { success, error } = await aceptarOferta(selectedOferta, ofertaSeleccionada.solicitud_id);
      
      if (error) throw error;
      
      if (success) {
        alert('¡Felicidades! Has seleccionado una oferta. Un representante del banco se pondrá en contacto contigo pronto.');
        setShowConfirmModal(false);
        // Redireccionar a una página de confirmación
        router.push('/confirmacion');
      }
    } catch (error) {
      console.error('Error al aceptar oferta:', error);
      alert('Hubo un error al procesar tu selección. Por favor, intenta de nuevo.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <>
      <Head>
        <title>Tus Ofertas | Fingro</title>
        <meta name="description" content="Revisa y compara tus ofertas de crédito personalizadas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Tus Ofertas Personalizadas</h1>
            <p className="mt-2 text-center text-gray-600">
              Compara y elige la mejor opción para ti
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : ofertas.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Banco
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasa
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plazo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuota Mensual
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ofertas.map((oferta) => (
                      <tr key={oferta.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {/* Placeholder para logo del banco */}
                              <span className="text-sm font-medium text-gray-700">{oferta.banco_nombre.substring(0, 2)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{oferta.banco_nombre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(oferta.monto)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{oferta.tasa}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{oferta.plazo} meses</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(oferta.cuota_mensual)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleSelectOferta(oferta.id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md transition-colors"
                          >
                            Elegir oferta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <FiAlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay ofertas disponibles</h3>
              <p className="mt-2 text-gray-600">
                Aún no tenemos ofertas disponibles para tu perfil. Por favor, verifica más tarde.
              </p>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Información importante</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Las ofertas mostradas son personalizadas según tu perfil crediticio. 
                    La aprobación final está sujeta a verificación de documentos por parte del banco.
                    Las ofertas tienen una validez limitada, indicada en cada propuesta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar selección</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas seleccionar esta oferta? Un representante del banco se pondrá en contacto contigo para continuar con el proceso.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
