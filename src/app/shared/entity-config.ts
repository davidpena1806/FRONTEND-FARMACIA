export type FieldType = 'text' | 'number' | 'checkbox' | 'date' | 'datetime' | 'select' | 'textarea' | 'password';

export interface SelectOption {
  entityKey: string;   // clave dentro de ENTITY_CONFIGS de donde sacar las opciones
  labelFn: (item: any) => string;
}

export interface FieldConfig {
  key: string;              // nombre de la propiedad en el modelo (camelCase)
  label: string;
  type: FieldType;
  required?: boolean;
  requiredOnCreate?: boolean;   // obligatorio solo al crear (ej. contraseña)
  select?: SelectOption;    // solo si type === 'select'
  defaultValue?: any;
  hint?: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  valueFn?: (row: any) => string;  // para mostrar datos anidados, ej. row.categoria?.nombre
  isBoolean?: boolean;
}

export interface EntityConfig {
  key: string;              // identificador interno, ej. 'productos'
  apiPath: string;          // segmento de ruta de la API, ej. 'lotes-producto'
  title: string;            // título mostrado en la página
  singular: string;         // usado en mensajes: "Categoría creada", "Producto eliminado"
  columns: ColumnConfig[];
  fields: FieldConfig[];
  allowEdit?: boolean;      // default true
  allowDelete?: boolean;    // default true
  softDeleteField?: string; // si el DELETE es baja lógica, qué campo booleano cambia (solo informativo en UI)
}

export const ENTITY_CONFIGS: Record<string, EntityConfig> = {

  roles: {
    key: 'roles',
    apiPath: 'roles',
    title: 'Roles',
    singular: 'Rol',
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'descripcion', label: 'Descripción' }
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' }
    ]
  },

  categorias: {
    key: 'categorias',
    apiPath: 'categorias',
    title: 'Categorías',
    singular: 'Categoría',
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'descripcion', label: 'Descripción' },
      { key: 'activo', label: 'Activo', isBoolean: true }
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true }
    ]
  },

  proveedores: {
    key: 'proveedores',
    apiPath: 'proveedores',
    title: 'Proveedores',
    singular: 'Proveedor',
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'razonSocial', label: 'Razón social' },
      { key: 'ruc', label: 'RUC' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'activo', label: 'Activo', isBoolean: true }
    ],
    fields: [
      { key: 'razonSocial', label: 'Razón social', type: 'text', required: true },
      { key: 'ruc', label: 'RUC', type: 'text', required: true },
      { key: 'nombreContacto', label: 'Nombre de contacto', type: 'text' },
      { key: 'telefono', label: 'Teléfono', type: 'text' },
      { key: 'correo', label: 'Correo', type: 'text' },
      { key: 'direccion', label: 'Dirección', type: 'text' },
      { key: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true }
    ]
  },

  clientes: {
    key: 'clientes',
    apiPath: 'clientes',
    title: 'Clientes',
    singular: 'Cliente',
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellido', label: 'Apellido' },
      { key: 'documento', label: 'Documento' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'activo', label: 'Activo', isBoolean: true }
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'apellido', label: 'Apellido', type: 'text' },
      { key: 'tipoDocumento', label: 'Tipo de documento', type: 'text', hint: 'Ej: DNI, RUC, CE' },
      { key: 'documento', label: 'N° de documento', type: 'text' },
      { key: 'telefono', label: 'Teléfono', type: 'text' },
      { key: 'correo', label: 'Correo', type: 'text' },
      { key: 'direccion', label: 'Dirección', type: 'text' },
      { key: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true }
    ]
  },

  usuarios: {
    key: 'usuarios',
    apiPath: 'usuarios',
    title: 'Usuarios',
    singular: 'Usuario',
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellido', label: 'Apellido' },
      { key: 'correo', label: 'Correo' },
      { key: 'rol', label: 'Rol', valueFn: (row) => row.rol?.nombre ?? `#${row.rolId}` },
      { key: 'activo', label: 'Activo', isBoolean: true }
    ],
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'apellido', label: 'Apellido', type: 'text', required: true },
      { key: 'correo', label: 'Correo', type: 'text', required: true },
      { key: 'password', label: 'Contraseña', type: 'password', requiredOnCreate: true,
        hint: 'Se guarda cifrada (BCrypt). Al editar, déjala vacía para conservar la actual.' },
      { key: 'rolId', label: 'Rol', type: 'select', required: true,
        select: { entityKey: 'roles', labelFn: (r) => r.nombre } },
      { key: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true }
    ]
  },

  productos: {
    key: 'productos',
    apiPath: 'productos',
    title: 'Productos',
    singular: 'Producto',
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'codigo', label: 'Código' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'categoria', label: 'Categoría', valueFn: (row) => row.categoria?.nombre ?? `#${row.categoriaId}` },
      { key: 'precioVenta', label: 'P. Venta', valueFn: (row) => `S/ ${Number(row.precioVenta).toFixed(2)}` },
      { key: 'stock', label: 'Stock' },
      { key: 'activo', label: 'Activo', isBoolean: true }
    ],
    fields: [
      { key: 'codigo', label: 'Código', type: 'text', required: true },
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'principioActivo', label: 'Principio activo', type: 'text' },
      { key: 'laboratorio', label: 'Laboratorio', type: 'text' },
      { key: 'presentacion', label: 'Presentación', type: 'text' },
      { key: 'unidadMedida', label: 'Unidad de medida', type: 'text', required: true },
      { key: 'precioVenta', label: 'Precio de venta', type: 'number', required: true },
      { key: 'precioCompraReferencial', label: 'Precio de compra referencial', type: 'number', required: true },
      { key: 'stock', label: 'Stock', type: 'number', defaultValue: 0,
        hint: 'El stock se actualiza automáticamente con Ingresos y Ventas.' },
      { key: 'stockMinimo', label: 'Stock mínimo', type: 'number', defaultValue: 0 },
      { key: 'requiereReceta', label: 'Requiere receta', type: 'checkbox', defaultValue: false },
      { key: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true },
      { key: 'categoriaId', label: 'Categoría', type: 'select', required: true,
        select: { entityKey: 'categorias', labelFn: (c) => c.nombre } }
    ]
  },

  'lotes-producto': {
    key: 'lotes-producto',
    apiPath: 'lotes-producto',
    title: 'Lotes de Producto',
    singular: 'Lote',
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'numeroLote', label: 'N° Lote' },
      { key: 'producto', label: 'Producto', valueFn: (row) => row.producto?.nombre ?? `#${row.productoId}` },
      { key: 'fechaVencimiento', label: 'Vencimiento', valueFn: (row) => (row.fechaVencimiento || '').substring(0, 10) },
      { key: 'stock', label: 'Stock' },
      { key: 'activo', label: 'Activo', isBoolean: true }
    ],
    fields: [
      { key: 'productoId', label: 'Producto', type: 'select', required: true,
        select: { entityKey: 'productos', labelFn: (p) => `${p.codigo} - ${p.nombre}` } },
      { key: 'numeroLote', label: 'N° de lote', type: 'text', required: true },
      { key: 'fechaVencimiento', label: 'Fecha de vencimiento', type: 'date', required: true },
      { key: 'stock', label: 'Stock', type: 'number', defaultValue: 0 },
      { key: 'precioCompra', label: 'Precio de compra', type: 'number', required: true },
      { key: 'fechaIngreso', label: 'Fecha de ingreso', type: 'date', required: true },
      { key: 'activo', label: 'Activo', type: 'checkbox', defaultValue: true }
    ]
  },

  'movimientos-inventario': {
    key: 'movimientos-inventario',
    apiPath: 'movimientos-inventario',
    title: 'Movimientos de Inventario',
    singular: 'Movimiento',
    allowEdit: false,
    allowDelete: false,
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'fecha', label: 'Fecha', valueFn: (row) => (row.fecha || '').replace('T', ' ').substring(0, 16) },
      { key: 'tipoMovimiento', label: 'Tipo' },
      { key: 'producto', label: 'Producto', valueFn: (row) => row.producto?.nombre ?? `#${row.productoId}` },
      { key: 'cantidad', label: 'Cantidad' },
      { key: 'stockAnterior', label: 'Stock ant.' },
      { key: 'stockPosterior', label: 'Stock post.' },
      { key: 'referencia', label: 'Referencia' }
    ],
    fields: [
      { key: 'productoId', label: 'Producto', type: 'select', required: true,
        select: { entityKey: 'productos', labelFn: (p) => `${p.codigo} - ${p.nombre}` } },
      { key: 'loteProductoId', label: 'Lote (opcional)', type: 'select',
        select: { entityKey: 'lotes-producto', labelFn: (l) => l.numeroLote } },
      { key: 'usuarioId', label: 'Usuario', type: 'select', required: true,
        select: { entityKey: 'usuarios', labelFn: (u) => `${u.nombre} ${u.apellido}` } },
      { key: 'tipoMovimiento', label: 'Tipo de movimiento', type: 'text', required: true,
        hint: 'Ej: AJUSTE_POSITIVO, AJUSTE_NEGATIVO, MERMA' },
      { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
      { key: 'referencia', label: 'Referencia', type: 'text' }
    ]
  },

  // Cajas tiene su propia página dedicada (apertura/cierre), pero necesita existir aquí
  // para que el campo "select" de Movimientos de Caja pueda cargar la lista de cajas.
  cajas: {
    key: 'cajas',
    apiPath: 'cajas',
    title: 'Cajas',
    singular: 'Caja',
    columns: [{ key: 'id', label: 'Id' }],
    fields: []
  },

  'movimientos-caja': {
    key: 'movimientos-caja',
    apiPath: 'movimientos-caja',
    title: 'Movimientos de Caja',
    singular: 'Movimiento de caja',
    allowEdit: false,
    allowDelete: false,
    columns: [
      { key: 'id', label: 'Id' },
      { key: 'fecha', label: 'Fecha', valueFn: (row) => (row.fecha || '').replace('T', ' ').substring(0, 16) },
      { key: 'cajaId', label: 'Caja', valueFn: (row) => `#${row.cajaId}` },
      { key: 'tipoMovimiento', label: 'Tipo' },
      { key: 'monto', label: 'Monto', valueFn: (row) => `S/ ${Number(row.monto).toFixed(2)}` },
      { key: 'descripcion', label: 'Descripción' }
    ],
    fields: [
      { key: 'cajaId', label: 'Caja', type: 'select', required: true,
        select: { entityKey: 'cajas', labelFn: (c) => `#${c.id} (${c.estado})` } },
      { key: 'usuarioId', label: 'Usuario', type: 'select', required: true,
        select: { entityKey: 'usuarios', labelFn: (u) => `${u.nombre} ${u.apellido}` } },
      { key: 'tipoMovimiento', label: 'Tipo', type: 'select', required: true,
        select: { entityKey: '__fixed_ingreso_egreso', labelFn: (o) => o.nombre } },
      { key: 'monto', label: 'Monto', type: 'number', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' }
    ]
  }
};

// Opciones fijas usadas por algún campo select que no proviene de una entidad de la API
export const FIXED_OPTIONS: Record<string, { id: string; nombre: string }[]> = {
  __fixed_ingreso_egreso: [
    { id: 'INGRESO', nombre: 'INGRESO' },
    { id: 'EGRESO', nombre: 'EGRESO' }
  ]
};
