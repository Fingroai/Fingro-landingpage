import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function Confirmacion() {
  const router = useRouter();
  // Definir interfaz para la oferta
  interface Oferta {
    id: string;
    banco_nombre: string;
    monto: number;
    tasa: number;
    plazo: number;
    cuota_mensual: number;
    requisitos: string[];
    estado: string;
    solicitud_id: string;
    created_at: string;
  }
  
  const [ofertaAceptada, setOfertaAceptada] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarOfertaAceptada = async () => {
      try {
        // Obtener la última solicitud del usuario
        let solicitudId;
        
        // Intentamos obtener la última solicitud creada
        // En producción, esto debería filtrarse por usuario autenticado
        const { data: solicitudes } = await supabase
          .from('solicitudes')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (solicitudes && solicitudes.length > 0) {
          solicitudId = solicitudes[0].id;
        }
        
        if (solicitudId) {
          // Buscar la oferta aceptada para esta solicitud
          const { data: ofertas } = await supabase
            .from('ofertas')
            .select('*')
            .eq('solicitud_id', solicitudId)
            .eq('estado', 'aceptada')
            .single();
          
          if (ofertas) {
            setOfertaAceptada(ofertas);
          }
        }
      } catch (error) {
        console.error('Error al cargar oferta aceptada:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarOfertaAceptada();
  }, []);

  const formatearMoneda = (monto: number | null | undefined): string => {
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

  return (
    <>
      <Head>
        <title>Confirmación | Fingro</title>
        <meta name="description" content="Confirmación de oferta seleccionada" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-center">
                <FiCheckCircle size={48} color="#10B981" />
                <h1 className="ml-3 text-2xl font-bold text-green-800">¡Felicidades!</h1>
              </div>
              <p className="mt-2 text-center text-green-700">
                Has seleccionado una oferta de crédito. Un representante del banco se pondrá en contacto contigo pronto.
              </p>
            </div>

            {ofertaAceptada ? (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la oferta seleccionada</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-700">{ofertaAceptada.banco_nombre.substring(0, 2)}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{ofertaAceptada.banco_nombre}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Monto aprobado</p>
                      <p className="text-lg font-medium text-gray-900">{formatearMoneda(ofertaAceptada.monto)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tasa de interés</p>
                      <p className="text-lg font-medium text-gray-900">{ofertaAceptada.tasa}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Plazo</p>
                      <p className="text-lg font-medium text-gray-900">{ofertaAceptada.plazo} meses</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cuota mensual</p>
                      <p className="text-lg font-medium text-gray-900">{formatearMoneda(ofertaAceptada.cuota_mensual)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Requisitos</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {ofertaAceptada.requisitos.map((requisito: string, index: number) => (
                      <li key={index} className="text-gray-700">{requisito}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Próximos pasos</h3>
                  <p className="text-blue-700">
                    Un representante de {ofertaAceptada.banco_nombre} se pondrá en contacto contigo en las próximas 24-48 horas
                    para coordinar la entrega de documentos y finalizar el proceso de desembolso.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-700">
                  No se encontró información de la oferta seleccionada. Por favor, contacta a soporte si crees que esto es un error.
                </p>
              </div>
            )}
            
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-center">
                <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
