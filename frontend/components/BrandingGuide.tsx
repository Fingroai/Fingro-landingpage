import React from 'react';

const BrandingGuide: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="title-large mb-8">Guía de Branding Fingro</h1>
      
      <section className="mb-12">
        <h2 className="title-medium mb-4">Colores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <div className="h-20 bg-primary-dark rounded-t-lg"></div>
            <div className="bg-white p-3 border border-t-0 border-secondary-grey rounded-b-lg">
              <p className="font-bold">Azul Oscuro</p>
              <p className="text-sm text-secondary-text">#08233D</p>
              <p className="text-xs text-secondary-text">bg-primary-dark</p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-primary-green rounded-t-lg"></div>
            <div className="bg-white p-3 border border-t-0 border-secondary-grey rounded-b-lg">
              <p className="font-bold">Verde</p>
              <p className="text-sm text-secondary-text">#34B796</p>
              <p className="text-xs text-secondary-text">bg-primary-green</p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-primary-yellow rounded-t-lg"></div>
            <div className="bg-white p-3 border border-t-0 border-secondary-grey rounded-b-lg">
              <p className="font-bold">Amarillo</p>
              <p className="text-sm text-secondary-text">#F8CD46</p>
              <p className="text-xs text-secondary-text">bg-primary-yellow</p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-secondary-grey rounded-t-lg"></div>
            <div className="bg-white p-3 border border-t-0 border-secondary-grey rounded-b-lg">
              <p className="font-bold">Gris</p>
              <p className="text-sm text-secondary-text">#F3F4F6</p>
              <p className="text-xs text-secondary-text">bg-secondary-grey</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="title-medium mb-4">Tipografía</h2>
        <div className="card">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-1">Título Grande (2xl)</h1>
            <p className="text-sm text-secondary-text">Font-size: 2rem (32px)</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1">Título Mediano (xl)</h2>
            <p className="text-sm text-secondary-text">Font-size: 1.5rem (24px)</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-1">Título Pequeño (lg)</h3>
            <p className="text-sm text-secondary-text">Font-size: 1.25rem (20px)</p>
          </div>
          
          <div className="mb-4">
            <p className="text-base mb-1">Texto Base (base)</p>
            <p className="text-sm text-secondary-text">Font-size: 1rem (16px)</p>
          </div>
          
          <div>
            <p className="text-sm mb-1">Texto Pequeño (sm)</p>
            <p className="text-sm text-secondary-text">Font-size: 0.875rem (14px)</p>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="title-medium mb-4">Botones</h2>
        <div className="card">
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Botón Primario</button>
            <button className="btn-secondary">Botón Secundario</button>
            <button className="btn-accent">Botón Acento</button>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="title-medium mb-4">Formularios</h2>
        <div className="card">
          <div className="mb-4">
            <label className="form-label">Etiqueta de Campo</label>
            <input type="text" className="form-input" placeholder="Placeholder de entrada" />
          </div>
          
          <div className="mb-4">
            <label className="form-label">Campo con Error</label>
            <input type="text" className="form-input border-red-500" placeholder="Entrada con error" />
            <p className="form-error">Mensaje de error de ejemplo</p>
          </div>
          
          <div>
            <label className="form-label">Selector</label>
            <select className="form-input">
              <option value="">Seleccione una opción</option>
              <option value="1">Opción 1</option>
              <option value="2">Opción 2</option>
            </select>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="title-medium mb-4">Tarjetas y Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="title-small mb-2">Tarjeta de Ejemplo</h3>
            <p className="mb-4">Este es un ejemplo de tarjeta con el estilo de Fingro.</p>
            <div className="flex gap-2">
              <span className="badge-success">Aprobado</span>
            </div>
          </div>
          
          <div className="card">
            <h3 className="title-small mb-2">Oferta Pendiente</h3>
            <p className="mb-4">Esta oferta está pendiente de revisión.</p>
            <div className="flex gap-2">
              <span className="badge-warning">Pendiente</span>
            </div>
          </div>
          
          <div className="card">
            <h3 className="title-small mb-2">Información</h3>
            <p className="mb-4">Información adicional sobre el proceso.</p>
            <div className="flex gap-2">
              <span className="badge-info">Info</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandingGuide;
