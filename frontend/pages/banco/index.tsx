import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

// Componente de panel de bancos
export default function PanelBanco() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Definir interfaces para los tipos de datos
  interface Solicitud {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    monto_solicitado: number;
    proposito: string;
    score: number;
    created_at: string;
  }

  interface Oferta {
    id: string;
    banco_id: string;
    solicitud_id: string;
    monto: number;
    tasa: number;
    plazo: number;
    cuota_mensual: number;
    estado: string;
    created_at: string;
    fecha_aceptacion?: string;
    notificacion_leida?: boolean;
    solicitudes?: Solicitud;
  }

  interface BancoInfo {
    id: string;
    nombre: string;
    user_id: string;
  }

  const [solicitudes, setSolicitudes] = useState([] as Solicitud[]);
  const [ofertas, setOfertas] = useState([] as Oferta[]);
  const [ofertasAceptadas, setOfertasAceptadas] = useState([] as Oferta[]);
  const [ofertasNuevasAceptadas, setOfertasNuevasAceptadas] = useState(0);
  const [filtro, setFiltro] = useState('todas');
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [bancoInfo, setBancoInfo] = useState(null as BancoInfo | null);

  // Comprobar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/banco/login');
        return;
      }
      
      setIsAuthenticated(true);
      
      // Obtener información del banco
      const { data: bancoData, error: bancoError } = await supabase
        .from('bancos')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (bancoError) {
        console.error('Error al obtener información del banco:', bancoError);
        return;
      }
      
      setBancoInfo(bancoData);
      
      // Cargar datos según la pestaña activa
      if (activeTab === 'solicitudes') {
        cargarSolicitudes();
      } else if (activeTab === 'ofertas') {
        cargarOfertas();
      } else if (activeTab === 'aceptadas') {
        cargarOfertasAceptadas();
      }
    };
    
    checkAuth();
  }, [activeTab]);

  // Cargar solicitudes desde Supabase
  const cargarSolicitudes = async () => {
    setIsLoading(true);
    
    try {
      if (!bancoInfo) return;
      
      let query = supabase
        .from('solicitudes')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Aplicar filtros si es necesario
      if (filtro === 'alto_score') {
        query = query.gte('score', 70);
      } else if (filtro === 'medio_score') {
        query = query.gte('score', 40).lt('score', 70);
      } else if (filtro === 'bajo_score') {
        query = query.lt('score', 40);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setSolicitudes(data || []);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      alert('Error al cargar las solicitudes. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar ofertas enviadas por el banco
  const cargarOfertas = async () => {
    setIsLoading(true);
    
    try {
      if (!bancoInfo) return;
      
      const { data, error } = await supabase
        .from('ofertas')
        .select('*, solicitudes(*)')
        .eq('banco_id', bancoInfo.id)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOfertas(data || []);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
      alert('Error al cargar las ofertas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar ofertas aceptadas por los usuarios
  const cargarOfertasAceptadas = async () => {
    setIsLoading(true);
    
    try {
      if (!bancoInfo) return;
      
      const { data, error } = await supabase
        .from('ofertas')
        .select('*, solicitudes(*)')
        .eq('banco_id', bancoInfo.id)
        .eq('estado', 'aceptada')
        .order('fecha_aceptacion', { ascending: false });
      
      if (error) throw error;
      
      setOfertasAceptadas(data || []);
      
      // Contar ofertas con notificaciones no leídas
      const ofertasNoLeidas = (data || []).filter((oferta: Oferta) => oferta.notificacion_leida === false).length;
      setOfertasNuevasAceptadas(ofertasNoLeidas);
      
      // Si estamos en la pestaña de ofertas aceptadas, marcar todas como leídas
      if (activeTab === 'aceptadas' && ofertasNoLeidas > 0) {
        const ofertasIds = (data || [])
          .filter((oferta: Oferta) => oferta.notificacion_leida === false)
          .map((oferta: Oferta) => oferta.id);
          
        if (ofertasIds.length > 0) {
          await supabase
            .from('ofertas')
            .update({ notificacion_leida: true })
            .in('id', ofertasIds);
            
          setOfertasNuevasAceptadas(0);
        }
      }
    } catch (error) {
      console.error('Error al cargar ofertas aceptadas:', error);
      alert('Error al cargar las ofertas aceptadas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio de filtro
  const handleFiltroChange = (nuevoFiltro: string) => {
    setFiltro(nuevoFiltro);
    cargarSolicitudes();
  };

  // Ir a la página de detalle de solicitud
  const verDetalleSolicitud = (id: string) => {
    router.push(`/banco/solicitud/${id}`);
  };

  // Ir a la página para crear oferta
  const crearOferta = (id: string) => {
    router.push(`/banco/crear-oferta/${id}`);
  };

  // Formatear fecha
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener clase de color según score
  const getScoreClass = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Panel de Banco | Fingro</title>
        <meta name="description" content="Panel para bancos asociados de Fingro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Banco</h1>
              <p className="mt-1 text-sm text-gray-600">
                {bancoInfo ? bancoInfo.nombre : 'Cargando...'} - Gestiona solicitudes y ofertas de crédito
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => supabase.auth.signOut().then(() => router.push('/banco/login'))}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
          
          {/* Pestañas de navegación */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('solicitudes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'solicitudes' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Solicitudes Nuevas
              </button>
              <button
                onClick={() => setActiveTab('ofertas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ofertas' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Ofertas Enviadas
              </button>
              <button
                onClick={() => setActiveTab('aceptadas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm relative ${activeTab === 'aceptadas' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Ofertas Aceptadas
                {ofertasNuevasAceptadas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {ofertasNuevasAceptadas}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Contenido de la pestaña activa */}
          {activeTab === 'solicitudes' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Solicitudes de Crédito</h2>
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <button
                      onClick={() => handleFiltroChange('todas')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filtro === 'todas' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => handleFiltroChange('alto_score')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filtro === 'alto_score' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Score Alto
                    </button>
                    <button
                      onClick={() => handleFiltroChange('medio_score')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filtro === 'medio_score' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Score Medio
                    </button>
                    <button
                      onClick={() => handleFiltroChange('bajo_score')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filtro === 'bajo_score' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Score Bajo
                    </button>
                  </div>
                </div>
              </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : solicitudes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propósito
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {solicitudes.map((solicitud: any) => (
                      <tr key={solicitud.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{solicitud.nombre} {solicitud.apellido}</div>
                              <div className="text-sm text-gray-500">{solicitud.correo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Intl.NumberFormat('es-GT', {
                              style: 'currency',
                              currency: 'GTQ',
                            }).format(solicitud.monto_solicitado)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{solicitud.proposito}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreClass(solicitud.score)}`}>
                            {solicitud.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatearFecha(solicitud.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => verDetalleSolicitud(solicitud.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Ver detalle
                          </button>
                          <button
                            onClick={() => crearOferta(solicitud.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Crear oferta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontraron solicitudes con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
          )}
          
          {/* Pestaña de Ofertas Enviadas */}
          {activeTab === 'ofertas' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Ofertas Enviadas</h2>
                <p className="mt-1 text-sm text-gray-600">Ofertas que has enviado a los solicitantes</p>
              </div>
              
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : ofertas.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No has enviado ofertas aún.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto Ofertado
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
                          Fecha Envío
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ofertas.map((oferta: any) => (
                        <tr key={oferta.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {oferta.solicitudes?.nombre} {oferta.solicitudes?.apellido}
                            </div>
                            <div className="text-sm text-gray-500">{oferta.solicitudes?.correo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(oferta.monto)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{oferta.tasa}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{oferta.plazo} meses</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(oferta.cuota_mensual)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatearFecha(oferta.created_at)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {/* Pestaña de Ofertas Aceptadas */}
          {activeTab === 'aceptadas' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Ofertas Aceptadas</h2>
                <p className="mt-1 text-sm text-gray-600">Ofertas que han sido aceptadas por los solicitantes</p>
              </div>
              
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : ofertasAceptadas.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No tienes ofertas aceptadas aún.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto Aprobado
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
                          Fecha Aceptación
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ofertasAceptadas.map((oferta: any) => (
                        <tr key={oferta.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {oferta.solicitudes?.nombre} {oferta.solicitudes?.apellido}
                            </div>
                            <div className="text-sm text-gray-500">{oferta.solicitudes?.correo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(oferta.monto)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{oferta.tasa}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{oferta.plazo} meses</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(oferta.cuota_mensual)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatearFecha(oferta.created_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => verDetalleSolicitud(oferta.solicitud_id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
