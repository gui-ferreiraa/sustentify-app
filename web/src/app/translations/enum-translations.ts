import { Department } from "../core/enums/department.enum";

export const EnumTranslations = {
  Category: {
    ELECTRONIC: 'Eletrônico',
    PLASTIC: 'Plástico',
    METAL: 'Metal',
    TEXTILE: 'Têxtil',
    WOOD: 'Madeira',
    GLASS: 'Vidro',
    FOOD: 'Alimento',
    CHEMICAL: 'Químico',
  },
  Condition: {
    NEW: 'Novo',
    USED: 'Usado',
    REFURBISHED: 'Recondicionado',
    DAMAGED: 'Danificado',
    EXPIRED: 'Vencido',
    AVAILABLE: 'Disponível',
  },
  Material: {
    PLASTIC: 'Plástico',
    METAL: 'Metal',
    GLASS: 'Vidro',
    WOOD: 'Madeira',
    PAPER: 'Papel',
    RUBBER: 'Borracha',
    FABRIC: 'Tecido',
    CERAMIC: 'Cerâmica',
    COMPOSITE: 'Compósito',
    OTHER: 'Outro',
  },
  Department: {
    ADMINISTRATIVE: 'Administrativo',
    SALES: 'Vendas',
    FINANCE: 'Financeiro',
    HR: 'Recursos Humanos',
    MARKETING: 'Marketing',
    IT: 'Tecnologia da Informação',
    PRODUCTION: 'Produção',
    LEGAL: 'Jurídico',
    SUPPORT: 'Suporte',
    LOGISTICS: 'Logística',
    RESEARCH_AND_DEVELOPMENT: 'Pesquisa e Desenvolvimento',
    SUSTAINABILITY: 'Sustentabilidade',
  }
} as const;
