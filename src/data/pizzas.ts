export interface Pizza {
  id: string
  name: string
  ingredients: string[]
  seasonal?: boolean
  description: string
  price: number
}

export const PIZZAS: Pizza[] = [
  {
    id: 'enoki',
    name: 'Enoki',
    ingredients: ['Hongo Enoki', 'Berenjena Asada', 'Tomate Cherry'],
    seasonal: true,
    description:
      'La delicadeza del hongo Enoki se encuentra con la profundidad de la berenjena asada y la frescura del tomate cherry. Una composición que celebra la sutileza.',
    price: 14990,
  },
  {
    id: 'leonera',
    name: 'Leonera',
    ingredients: ['Hongo Melena de León', 'Rösti de Papa', 'Cebolla'],
    seasonal: true,
    description:
      'El hongo Melena de León, con su textura que evoca mariscos, se complementa con la crocancia del rösti de papa y la dulzura natural de la cebolla.',
    price: 16990,
  },
  {
    id: 'porcina',
    name: 'Porcina',
    ingredients: ['Hongo Champiñón Paris', 'Tocino', 'Salame'],
    seasonal: false,
    description:
      'La terrosa elegancia del champiñón Paris se fusiona con la intensidad del tocino artesanal y el salame curado. Un tributo a lo clásico.',
    price: 13990,
  },
  {
    id: 'carnita',
    name: 'Carnita',
    ingredients: ['Carne Mechada', 'Cebolla Stout', 'Pastelera de Choclo'],
    seasonal: false,
    description:
      'Carne mechada lentamente deshilachada, cebolla caramelizada en cerveza stout y pastelera de choclo. Raíces chilenas en cada bocado.',
    price: 15990,
  },
  {
    id: 'veggie',
    name: 'Veggie',
    ingredients: ['Tomate Cherry', 'Albahaca', 'Cebolla Caramelizada'],
    seasonal: false,
    description:
      'La pureza del tomate cherry, la aromática albahaca fresca y la dulce complejidad de la cebolla caramelizada. Vegetariana, sin concesiones.',
    price: 12990,
  },
  {
    id: 'napolitana',
    name: 'Napolitana',
    ingredients: ['Jamón'],
    seasonal: false,
    description:
      'El respeto por la tradición napolitana en su máxima expresión. Masa madre de biga, salsa pomodoro, quesos seleccionados y jamón de calidad superior.',
    price: 11990,
  },
]

export const BASE_DESCRIPTION = 'Salsa Pomodoro · Mix de Quesos · Masa Madre de Biga · Horno a la Piedra'

export function formatCLP(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
}
