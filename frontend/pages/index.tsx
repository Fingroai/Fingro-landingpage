import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiArrowRight, FiCheckCircle, FiHelpCircle, FiShield, FiClock, FiDollarSign, FiStar, FiMenu, FiX } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Función para formatear moneda (Q 1,234.56)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Función para convertir texto a número
const parseCurrency = (text: string): number => {
  if (!text) return 0;
  // Eliminar todo excepto dígitos, puntos y comas
  const cleanedText = text.replace(/[^0-9.,]/g, '');
  // Reemplazar comas por puntos y convertir a número
  return parseInt(cleanedText.replace(/,/g, '')) || 0;
};

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Estados para la calculadora de crédito
  const [montoCredito, setMontoCredito] = useState(50000);
  const [plazoMeses, setPlazoMeses] = useState(48);
  const [cuotaMensual, setCuotaMensual] = useState(1312);
  const [tasaInteres, setTasaInteres] = useState(11.9);
  const [montoFormateado, setMontoFormateado] = useState('50,000');
  const [tasaModificadaManualmente, setTasaModificadaManualmente] = useState(false);
  
  // Calcular la cuota mensual cuando cambia el monto o el plazo
  useEffect(() => {
    calcularCuota(montoCredito, plazoMeses, tasaInteres);
  }, [montoCredito, plazoMeses, tasaInteres]);
  
  // Función para calcular la cuota mensual
  const calcularCuota = (monto: number, plazo: number, tasa: number): void => {
    // Convertir tasa anual a mensual (dividir por 12 y por 100 para pasar de porcentaje a decimal)
    const tasaMensual = tasa / 12 / 100;
    
    // Fórmula de cuota de préstamo: P = monto * (tasaMensual * (1 + tasaMensual)^plazo) / ((1 + tasaMensual)^plazo - 1)
    const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1);
    
    // Redondear a 2 decimales
    setCuotaMensual(Math.round(cuota));
  };
  
  // Manejar cambio en el monto del crédito
  const handleMontoChange = (e: { target: { value: string } }): void => {
    const inputValue = e.target.value;
    
    // Permitir solo números, comas, puntos y el símbolo Q
    if (/^[Q\s\d,.]*$/.test(inputValue)) {
      setMontoFormateado(inputValue.replace(/[Q\s]/g, ''));
      const numericValue = parseCurrency(inputValue);
      
      // Validar límites
      if (numericValue >= 1000 && numericValue <= 1000000) {
        setMontoCredito(numericValue);
      }
    }
  };
  
  // Formatear el monto cuando pierde el foco
  const handleMontoBlur = () => {
    setMontoFormateado(formatCurrency(montoCredito));
  };
  
  // Seleccionar plazo
  const handlePlazoSelect = (plazo: number): void => {
    setPlazoMeses(plazo);
    
    // Ajustar la tasa según el plazo (ejemplo simple) solo si no ha sido modificada manualmente
    if (!tasaModificadaManualmente) {
      if (plazo <= 24) {
        setTasaInteres(10.9);
      } else if (plazo <= 48) {
        setTasaInteres(11.9);
      } else if (plazo <= 72) {
        setTasaInteres(12.9);
      } else {
        setTasaInteres(13.9);
      }
    }
  };
  
  // Manejar cambio en la tasa de interés
  const handleTasaChange = (e: { target: { value: string } }): void => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(inputValue);
    
    // Validar límites (entre 1% y 50%)
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 50) {
      setTasaInteres(numericValue);
      setTasaModificadaManualmente(true);
    }
  };

  const handleSolicitarCredito = () => {
    router.push('/formulario');
  };

  return (
    <>
      <Head>
        <title>Fingro | Marketplace de Créditos</title>
        <meta name="description" content="Encuentra las mejores ofertas de crédito personalizadas para ti" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary-dark">Fingro</span>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="-mr-2 -my-2 md:hidden">
              <button 
                type="button" 
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-primary-dark hover:text-primary-green focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Abrir menú</span>
                <FiMenu size={24} />
              </button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-10">
              <a href="#como-funciona" className="text-base font-medium text-secondary-text hover:text-primary-green transition-colors">Cómo funciona</a>
              <a href="#" className="text-base font-medium text-secondary-text hover:text-primary-green transition-colors">Productos</a>
              <a href="#" className="text-base font-medium text-secondary-text hover:text-primary-green transition-colors">Testimonios</a>
              <a href="#preguntas-frecuentes" className="text-base font-medium text-secondary-text hover:text-primary-green transition-colors">FAQ</a>
            </nav>
            
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <button
                onClick={handleSolicitarCredito}
                className="whitespace-nowrap inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-green hover:bg-primary-green-dark transition-colors"
              >
                Solicitar crédito
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on mobile menu state */}
        {mobileMenuOpen && (
          <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-primary-dark">Fingro</span>
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      className="bg-white rounded-md p-2 inline-flex items-center justify-center text-primary-dark hover:text-primary-green focus:outline-none"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Cerrar menú</span>
                      <FiX size={24} />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    <a href="#como-funciona" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                      <span className="flex-shrink-0 h-5 w-5 text-primary-green"><FiHelpCircle size={20} /></span>
                      <span className="ml-3 text-base font-medium text-secondary-text">Cómo funciona</span>
                    </a>
                    <a href="#" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                      <span className="flex-shrink-0 h-5 w-5 text-primary-green"><FiDollarSign size={20} /></span>
                      <span className="ml-3 text-base font-medium text-secondary-text">Productos</span>
                    </a>
                    <a href="#" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                      <span className="flex-shrink-0 h-5 w-5 text-primary-green"><FiStar size={20} /></span>
                      <span className="ml-3 text-base font-medium text-secondary-text">Testimonios</span>
                    </a>
                    <a href="#preguntas-frecuentes" className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                      <span className="flex-shrink-0 h-5 w-5 text-primary-green"><FiHelpCircle size={20} /></span>
                      <span className="ml-3 text-base font-medium text-secondary-text">FAQ</span>
                    </a>
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div className="grid grid-cols-1 gap-y-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSolicitarCredito();
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-green hover:bg-primary-green-dark"
                  >
                    Solicitar crédito
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="min-h-screen bg-gradient-to-b from-white to-secondary-grey">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-primary-green bg-opacity-10 rounded-full text-primary-green font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                #1 Marketplace de Créditos en Guatemala
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-dark tracking-tight leading-tight">
                <span className="block">Encuentra tu crédito ideal</span>
                <span className="block text-primary-green">en menos de 48 horas</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-secondary-text">
                Fingro te conecta con las mejores ofertas de crédito personalizadas según tu perfil. Sin comisiones ocultas.
              </p>
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleSolicitarCredito}
                  className="btn-primary inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base w-full sm:w-auto"
                >
                  Solicita tu crédito
                  <span className="ml-2 inline-block"><FiArrowRight /></span>
                </button>
                <div className="text-sm text-secondary-text flex items-center justify-center sm:justify-start mt-2 sm:mt-0">
                  <span className="mr-2">Proceso 100% gratuito</span>
                  <span className="text-primary-green"><FiCheckCircle /></span>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <span className="text-primary-green mb-1 sm:mb-0 sm:mr-2"><FiShield size={18} /></span>
                  <span className="text-xs sm:text-sm">Datos 100% seguros</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <span className="text-primary-green mb-1 sm:mb-0 sm:mr-2"><FiClock size={18} /></span>
                  <span className="text-xs sm:text-sm">Respuesta rápida</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <span className="text-primary-green mb-1 sm:mb-0 sm:mr-2"><FiDollarSign size={18} /></span>
                  <span className="text-xs sm:text-sm">Sin comisiones</span>
                </div>
              </div>
            </div>
            
            {/* Versión móvil de la tarjeta de crédito */}
            <div className="relative block md:hidden mt-6">
              <div className="bg-white p-4 rounded-lg shadow-xl mx-auto max-w-xs">
                <div className="bg-primary-dark p-3 rounded-lg text-white mb-3">
                  <h3 className="font-bold text-base mb-1">Crédito Aprobado</h3>
                  <p className="text-xs opacity-80">Oferta personalizada</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-secondary-text">Monto aprobado</p>
                    <p className="text-lg font-bold text-primary-dark">Q 50,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Tasa de interés</p>
                    <p className="text-lg font-bold text-primary-green">12.5%</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Plazo</p>
                    <p className="text-base font-bold text-primary-dark">60 meses</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Cuota mensual</p>
                    <p className="text-base font-bold text-primary-dark">Q 1,125</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Versión desktop de la tarjeta de crédito */}
            <div className="relative hidden md:block">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary-yellow opacity-10 rounded-full"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <div className="bg-primary-dark p-4 rounded-lg text-white mb-4">
                  <h3 className="font-bold text-lg mb-1">Crédito Aprobado</h3>
                  <p className="text-sm opacity-80">Oferta personalizada</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-text">Monto aprobado</p>
                    <p className="text-2xl font-bold text-primary-dark">Q 50,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-text">Tasa de interés</p>
                    <p className="text-2xl font-bold text-primary-green">12.5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-text">Plazo</p>
                    <p className="text-xl font-bold text-primary-dark">60 meses</p>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-secondary-grey h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-green h-full rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-secondary-text">Oferta válida por 7 días</p>
                  </div>
                </div>
              </div>
              

            </div>
          </div>
          

        </section>

        {/* Process Section */}
        <section id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1 bg-primary-yellow bg-opacity-20 rounded-full text-primary-dark font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
              Proceso simple y rápido
            </span>
            <h2 className="title-large text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
              Cómo funciona Fingro
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-secondary-text">
              Obtener el crédito ideal nunca ha sido tan fácil. Nuestro proceso está diseñado para maximizar tus posibilidades de aprobación.
            </p>
          </div>
          
          {/* Process Steps with Visual Timeline */}
          <div className="relative">
            {/* Timeline Line (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-24 left-1/2 w-0.5 h-[calc(100%-120px)] bg-primary-green bg-opacity-30 -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-24 relative">
              {/* Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl z-10">
                      1
                    </div>
                    <div className="h-0.5 w-8 sm:w-12 bg-primary-green ml-3 sm:ml-4 hidden md:block"></div>
                  </div>
                  <h3 className="title-medium text-lg sm:text-xl mb-2 sm:mb-3">Completa el formulario</h3>
                  <p className="text-sm sm:text-base text-secondary-text mb-3 sm:mb-4">
                    Nuestro formulario inteligente te guiará paso a paso. Solo pedimos datos relevantes para conseguirte las mejores ofertas.
                  </p>
                  <ul className="space-y-1 sm:space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-0.5"><FiCheckCircle size={16} /></span>
                      <span className="text-sm sm:text-base">Proceso guiado de 9 pasos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-0.5"><FiCheckCircle size={16} /></span>
                      <span className="text-sm sm:text-base">Guardado automático de tu progreso</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-0.5"><FiCheckCircle size={16} /></span>
                      <span className="text-sm sm:text-base">Tiempo estimado: 5-10 minutos</span>
                    </li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 bg-white p-2 rounded-lg shadow-lg mx-auto w-full max-w-sm md:max-w-none">
                  <div className="bg-secondary-grey bg-opacity-50 rounded-lg p-4 sm:p-6 relative">
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="pt-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-bold text-primary-dark mb-2">Datos Personales</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-secondary-text mb-1">Nombre completo</label>
                            <div className="h-8 bg-secondary-grey rounded w-full"></div>
                          </div>
                          <div>
                            <label className="block text-xs text-secondary-text mb-1">DPI</label>
                            <div className="h-8 bg-secondary-grey rounded w-full"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-secondary-text mb-1">Teléfono</label>
                              <div className="h-8 bg-secondary-grey rounded w-full"></div>
                            </div>
                            <div>
                              <label className="block text-xs text-secondary-text mb-1">Correo</label>
                              <div className="h-8 bg-secondary-grey rounded w-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2">
                  <div className="flex items-center mb-4 md:justify-end">
                    <div className="hidden md:block h-0.5 w-12 bg-primary-green mr-4"></div>
                    <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                      2
                    </div>
                  </div>
                  <h3 className="title-medium mb-3">Recibe ofertas personalizadas</h3>
                  <p className="text-secondary-text mb-4">
                    Nuestro algoritmo analiza tu perfil y lo presenta a múltiples bancos. Recibirás ofertas personalizadas con tasas preferenciales en menos de 48 horas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-1"><FiCheckCircle /></span>
                      <span>Comparación de hasta 5 ofertas diferentes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-1"><FiCheckCircle /></span>
                      <span>Tasas de interés preferenciales</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-1"><FiCheckCircle /></span>
                      <span>Notificación por correo y SMS</span>
                    </li>
                  </ul>
                </div>
                <div className="md:order-1">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-primary-dark">Tus Ofertas (3)</h4>
                      <span className="text-xs bg-primary-green text-white px-2 py-1 rounded-full">Nuevas</span>
                    </div>
                    <div className="space-y-3">
                      <div className="border border-secondary-grey rounded-lg p-3 hover:border-primary-green transition-colors cursor-pointer">
                        <div className="flex justify-between">
                          <p className="font-bold">Banco Nacional</p>
                          <p className="text-primary-green font-bold">12.5%</p>
                        </div>
                        <div className="flex justify-between text-sm text-secondary-text">
                          <p>Q 50,000</p>
                          <p>60 meses</p>
                        </div>
                      </div>
                      <div className="border border-secondary-grey rounded-lg p-3 hover:border-primary-green transition-colors cursor-pointer bg-primary-yellow bg-opacity-5">
                        <div className="flex justify-between">
                          <p className="font-bold">Banco Industrial</p>
                          <p className="text-primary-green font-bold">11.9%</p>
                        </div>
                        <div className="flex justify-between text-sm text-secondary-text">
                          <p>Q 50,000</p>
                          <p>48 meses</p>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs bg-primary-yellow text-primary-dark px-2 py-0.5 rounded-full">Recomendado</span>
                        </div>
                      </div>
                      <div className="border border-secondary-grey rounded-lg p-3 hover:border-primary-green transition-colors cursor-pointer">
                        <div className="flex justify-between">
                          <p className="font-bold">Banco G&T</p>
                          <p className="text-primary-green font-bold">13.2%</p>
                        </div>
                        <div className="flex justify-between text-sm text-secondary-text">
                          <p>Q 45,000</p>
                          <p>60 meses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                      3
                    </div>
                    <div className="h-0.5 w-12 bg-primary-green ml-4 hidden md:block"></div>
                  </div>
                  <h3 className="title-medium mb-3">Elige la mejor opción y recibe tu dinero</h3>
                  <p className="text-secondary-text mb-4">
                    Compara todas las ofertas y selecciona la que mejor se adapte a tus necesidades. Una vez aceptada, el banco se pondrá en contacto contigo para finalizar el proceso.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-1"><FiCheckCircle /></span>
                      <span>Aceptación con un solo clic</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-1"><FiCheckCircle /></span>
                      <span>Desembolso rápido a tu cuenta</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-green mr-2 mt-1"><FiCheckCircle /></span>
                      <span>Soporte personalizado en todo momento</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <button
                      onClick={handleSolicitarCredito}
                      className="btn-primary inline-flex items-center justify-center px-6 py-3 text-base"
                    >
                      Comenzar ahora
                      <span className="ml-2 inline-block"><FiArrowRight /></span>
                    </button>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="bg-primary-dark text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold">Oferta Aceptada</h4>
                        <span className="bg-primary-green text-white text-xs px-2 py-0.5 rounded-full">Aprobada</span>
                      </div>
                      <p className="text-sm opacity-80 mb-4">Banco Industrial</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs opacity-80">Monto</p>
                          <p className="text-xl font-bold">Q 50,000</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-80">Tasa anual</p>
                          <p className="text-xl font-bold text-primary-yellow">11.9%</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-80">Plazo</p>
                          <p className="text-lg font-bold">48 meses</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-80">Cuota mensual</p>
                          <p className="text-lg font-bold">Q 1,312</p>
                        </div>
                      </div>
                      
                      <div className="bg-white bg-opacity-10 p-3 rounded text-sm">
                        <p className="font-bold mb-1">Próximos pasos:</p>
                        <p className="opacity-90">Un ejecutivo se comunicará contigo en las próximas 24 horas para coordinar la firma de documentos y el desembolso.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="preguntas-frecuentes" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-secondary-grey bg-opacity-30 rounded-xl">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="inline-block px-3 py-1 bg-primary-dark bg-opacity-10 rounded-full text-primary-dark font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
              Resolvemos tus dudas
            </span>
            <h2 className="title-large text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-base sm:text-lg text-secondary-text">
              Todo lo que necesitas saber sobre Fingro y tu crédito ideal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex items-start sm:items-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-green bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                    <span className="text-primary-green"><FiHelpCircle size={16} /></span>
                  </div>
                  <h3 className="title-small text-base sm:text-lg font-semibold">¿Es gratis usar Fingro?</h3>
                </div>
                <p className="text-sm sm:text-base text-secondary-text">
                  <span className="font-bold text-primary-dark">Sí, es 100% gratuito</span>. Fingro no cobra comisiones a los usuarios. Nuestros ingresos provienen de comisiones pagadas por instituciones financieras cuando eliges una oferta.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex items-start sm:items-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-green bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                    <span className="text-primary-green"><FiClock size={16} /></span>
                  </div>
                  <h3 className="title-small text-base sm:text-lg font-semibold">¿Cuánto tiempo toma recibir ofertas?</h3>
                </div>
                <p className="text-sm sm:text-base text-secondary-text">
                  Una vez completado el formulario, recibirás ofertas personalizadas en <span className="font-bold text-primary-dark">24 a 48 horas hábiles</span>. Nuestro sistema trabaja rápidamente para conectarte con las mejores opciones.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex items-start sm:items-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-green bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                    <span className="text-primary-green"><FiShield size={16} /></span>
                  </div>
                  <h3 className="title-small text-base sm:text-lg font-semibold">¿Mis datos están seguros?</h3>
                </div>
                <p className="text-sm sm:text-base text-secondary-text">
                  <span className="font-bold text-primary-dark">Absolutamente</span>. Utilizamos encriptación de nivel bancario y nunca compartimos tus datos sin tu consentimiento explícito. Tu seguridad es nuestra prioridad.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4 sm:p-6">
                <div className="flex items-start sm:items-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-green bg-opacity-10 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                    <span className="text-primary-green"><FiDollarSign size={16} /></span>
                  </div>
                  <h3 className="title-small text-base sm:text-lg font-semibold">¿Qué tipos de créditos puedo solicitar?</h3>
                </div>
                <p className="text-sm sm:text-base text-secondary-text">
                  Con Fingro puedes solicitar diversos tipos de créditos: personales, hipotecarios, automotrices, consolidación de deudas y para emprendimientos. <span className="font-bold text-primary-dark">Tú eliges el propósito</span>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 sm:mt-10">
            <p className="text-secondary-text text-sm sm:text-base mb-3 sm:mb-4">¿Tienes más preguntas?</p>
            <a href="#" className="text-primary-green font-bold text-sm sm:text-base hover:underline">Ver todas las preguntas frecuentes</a>
          </div>
          
          {/* Testimonials */}
          <div className="mt-12 sm:mt-20">
            <h3 className="text-center title-medium text-xl sm:text-2xl mb-6 sm:mb-10">Lo que dicen nuestros usuarios</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex text-primary-yellow mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="inline-block"><FiStar size={16} /></span>
                  ))}
                </div>
                <p className="text-secondary-text text-sm sm:text-base mb-3 sm:mb-4">
                  "Conseguí un crédito con una tasa mucho mejor de lo que esperaba. El proceso fue rápido y sin complicaciones."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-dark text-white flex items-center justify-center mr-2 sm:mr-3 font-bold text-xs sm:text-base">
                    MG
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">María González</p>
                    <p className="text-xs sm:text-sm text-secondary-text">Crédito personal</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex text-primary-yellow mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="inline-block"><FiStar size={16} /></span>
                  ))}
                </div>
                <p className="text-secondary-text text-sm sm:text-base mb-3 sm:mb-4">
                  "Pude comparar varias ofertas y elegir la que mejor se adaptaba a mis necesidades. El ahorro fue significativo."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-dark text-white flex items-center justify-center mr-2 sm:mr-3 font-bold text-xs sm:text-base">
                    JR
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">Juan Ramírez</p>
                    <p className="text-xs sm:text-sm text-secondary-text">Crédito hipotecario</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-sm sm:max-w-none">
                <div className="flex text-primary-yellow mb-3 sm:mb-4">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="inline-block"><FiStar size={16} /></span>
                  ))}
                  <span className="inline-block text-secondary-grey"><FiStar size={16} /></span>
                </div>
                <p className="text-secondary-text text-sm sm:text-base mb-3 sm:mb-4">
                  "El proceso fue muy sencillo y la atención personalizada me ayudó a resolver todas mis dudas. En menos de 48h ya tenía ofertas."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-dark text-white flex items-center justify-center mr-2 sm:mr-3 font-bold text-xs sm:text-base">
                    LC
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">Laura Castillo</p>
                    <p className="text-xs sm:text-sm text-secondary-text">Crédito para negocio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="solicitar" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-10 sm:my-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-dark rounded-xl sm:rounded-2xl"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-primary-yellow"></div>
            <div className="absolute bottom-5 sm:bottom-10 right-10 sm:right-20 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-primary-green"></div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                ¿Listo para encontrar el crédito que necesitas?
              </h2>
              <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8">
                Únete a los miles de guatemaltecos que ya encontraron su crédito ideal con Fingro. El proceso es simple, rápido y totalmente gratuito.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSolicitarCredito}
                  className="btn-accent inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
                >
                  Solicita tu crédito ahora
                  <span className="ml-2 inline-block"><FiArrowRight /></span>
                </button>
                
                <a href="#" className="text-white opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center text-sm sm:text-base">
                  <span className="mr-2">Ver testimonios</span>
                  <span className="inline-block"><FiCheckCircle size={16} /></span>
                </a>
              </div>
              
              <div className="mt-6 sm:mt-8 flex items-center">
                <div className="flex -space-x-1 sm:-space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-primary-dark flex items-center justify-center border-2 border-primary-dark font-bold text-[10px] sm:text-xs">
                      {['MG', 'JR', 'LC', 'AP'][i]}
                    </div>
                  ))}
                </div>
                <p className="ml-2 sm:ml-3 text-xs sm:text-sm opacity-90">Se unieron +500 personas este mes</p>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl">
              <div className="bg-secondary-grey bg-opacity-30 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-primary-dark text-sm sm:text-base">Calculadora de crédito</h3>
                  <span className="text-[10px] sm:text-xs bg-primary-green text-white px-2 py-0.5 sm:py-1 rounded-full">Estimado</span>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-secondary-text mb-1">¿Cuánto necesitas?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm sm:text-base">Q</span>
                    <input 
                      type="text" 
                      className="form-input pl-8 text-sm sm:text-base py-2 sm:py-2.5 w-full" 
                      placeholder="50,000" 
                      value={montoFormateado}
                      onChange={handleMontoChange}
                      onBlur={handleMontoBlur}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm text-secondary-text mb-1">Plazo (meses)</label>
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {[24, 36, 48, 60, 72, 84].map((month, i) => (
                      <div 
                        key={i} 
                        className={`text-center py-1.5 sm:py-2 border rounded-md cursor-pointer text-xs sm:text-sm ${month === plazoMeses ? 'bg-primary-green text-white border-primary-green' : 'border-secondary-grey hover:border-primary-green'}`}
                        onClick={() => handlePlazoSelect(month)}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 sm:pt-4 border-t">
                  <div className="flex justify-between mb-1 sm:mb-2">
                    <p className="text-secondary-text text-xs sm:text-sm">Cuota estimada:</p>
                    <p className="font-bold text-primary-dark text-sm sm:text-base">Q {cuotaMensual.toLocaleString()} /mes</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-secondary-text mb-1">Tasa de interés (%)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="form-input pr-10 text-sm sm:text-base py-2 sm:py-2.5 w-full text-right font-bold text-primary-green" 
                        value={tasaInteres}
                        onChange={handleTasaChange}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary-green text-sm sm:text-base ml-2">%</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSolicitarCredito}
                  className="btn-primary w-full py-2.5 sm:py-3 mt-2 text-sm sm:text-base"
                >
                  Obtener ofertas personalizadas
                </button>
                
                <p className="text-[10px] sm:text-xs text-center text-secondary-text">
                  Sin compromiso. Proceso 100% gratuito.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold">Fingro</h3>
                <span className="ml-2 bg-primary-yellow text-primary-dark text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold">GT</span>
              </div>
              <p className="text-white opacity-80 mb-4 sm:mb-6 text-sm sm:text-base">
                El marketplace de créditos que conecta usuarios con las mejores ofertas financieras en Guatemala.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 transition-all">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Productos</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Créditos Personales</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Créditos Hipotecarios</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Créditos Automotrices</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Consolidación de Deudas</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Créditos para Negocios</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Empresa</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Sobre nosotros</a></li>
                  <li><a href="#como-funciona" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Cómo funciona</a></li>
                  <li><a href="#preguntas-frecuentes" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Preguntas frecuentes</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Testimonios</a></li>
                  <li><a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-sm sm:text-base">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Contacto</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-white opacity-80 text-sm sm:text-base">info@fingro.com</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="text-white opacity-80 text-sm sm:text-base">+502 2456 7890</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-white opacity-80 text-sm sm:text-base">Zona 10, Ciudad de Guatemala</span>
                  </li>
                </ul>
                
                <div className="mt-4 sm:mt-6">
                  <h4 className="text-xs sm:text-sm font-semibold mb-2">Suscríbete a nuestro newsletter</h4>
                  <div className="flex">
                    <input type="email" placeholder="Tu correo electrónico" className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white bg-opacity-10 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-yellow text-white w-full" />
                    <button className="bg-primary-yellow text-primary-dark px-2 sm:px-4 py-1.5 sm:py-2 rounded-r-md font-bold text-xs sm:text-sm hover:bg-opacity-90 transition-colors">
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-opacity-20 border-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white opacity-80 mb-4 md:mb-0 text-xs sm:text-sm text-center md:text-left">© {new Date().getFullYear()} Fingro. Todos los derechos reservados.</p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 items-center">
                <a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-xs sm:text-sm">Términos y condiciones</a>
                <a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-xs sm:text-sm">Política de privacidad</a>
                <a href="#" className="text-white opacity-80 hover:text-primary-yellow hover:opacity-100 transition-colors text-xs sm:text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
