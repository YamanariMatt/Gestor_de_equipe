// =====================================================
// NEF - Utilitários e Helpers
// Sistema de Gestão de Equipe
// =====================================================

// Formatação de dados
export const formatters = {
  // Formatar CPF
  cpf: (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  // Formatar telefone
  phone: (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  },

  // Formatar moeda
  currency: (value) => {
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  // Formatar data
  date: (date, options = {}) => {
    if (!date) return '';
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    };
    return new Date(date).toLocaleDateString('pt-BR', defaultOptions);
  },

  // Formatar data e hora
  datetime: (datetime) => {
    if (!datetime) return '';
    return new Date(datetime).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Formatar duração em dias
  duration: (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
};

// Validações
export const validators = {
  // Validar email
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validar CPF
  cpf: (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cleaned.charAt(10));
  },

  // Validar telefone
  phone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  },

  // Validar data
  date: (date) => {
    return date instanceof Date && !isNaN(date);
  },

  // Validar período de datas
  dateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return validators.date(start) && validators.date(end) && start <= end;
  }
};

// Utilitários de array
export const arrayUtils = {
  // Remover duplicatas
  unique: (array, key) => {
    if (!key) return [...new Set(array)];
    return array.filter((item, index, self) => 
      index === self.findIndex(t => t[key] === item[key])
    );
  },

  // Agrupar por chave
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Ordenar por chave
  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
  }
};

// Utilitários de string
export const stringUtils = {
  // Capitalizar primeira letra
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Capitalizar cada palavra
  titleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Truncar texto
  truncate: (str, length = 50, suffix = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  // Remover acentos
  removeAccents: (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  // Gerar slug
  slug: (str) => {
    if (!str) return '';
    return stringUtils.removeAccents(str)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
};

// Utilitários de localStorage
export const storage = {
  // Salvar no localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  },

  // Recuperar do localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return defaultValue;
    }
  },

  // Remover do localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  },

  // Limpar localStorage
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }
};

// Utilitários de URL
export const urlUtils = {
  // Construir query string
  buildQuery: (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        query.append(key, value);
      }
    });
    return query.toString();
  },

  // Extrair parâmetros da URL
  getParams: (url = window.location.search) => {
    const params = new URLSearchParams(url);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }
};

// Utilitários de debounce e throttle
export const timing = {
  // Debounce
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Utilitários de cores
export const colorUtils = {
  // Gerar cor aleatória
  random: () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  },

  // Verificar se cor é clara
  isLight: (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
  },

  // Obter cor de texto baseada no fundo
  getTextColor: (backgroundColor) => {
    return colorUtils.isLight(backgroundColor) ? '#000000' : '#FFFFFF';
  }
};

// Utilitários de arquivo
export const fileUtils = {
  // Formatar tamanho de arquivo
  formatSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Verificar tipo de arquivo
  getType: (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const types = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
      document: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
      spreadsheet: ['xls', 'xlsx', 'csv'],
      presentation: ['ppt', 'pptx']
    };
    
    for (const [type, extensions] of Object.entries(types)) {
      if (extensions.includes(extension)) return type;
    }
    return 'other';
  }
};

// Constantes úteis
export const constants = {
  ROLES: {
    ADMIN: 'admin',
    SUPERVISOR: 'supervisor',
    GESTOR: 'gestor',
    GERENTE: 'gerente',
    RH: 'rh'
  },
  
  FALTA_TIPOS: {
    FALTA: 'falta',
    ATRASO: 'atraso',
    SAIDA_ANTECIPADA: 'saida_antecipada',
    MEDICA: 'medica',
    JUSTIFICADA: 'justificada'
  },
  
  STATUS: {
    PENDENTE: 'pendente',
    APROVADO: 'aprovado',
    REJEITADO: 'rejeitado',
    CANCELADO: 'cancelado'
  },
  
  CONTRATO_TIPOS: {
    CLT: 'clt',
    PJ: 'pj',
    ESTAGIARIO: 'estagiario',
    TERCEIRIZADO: 'terceirizado'
  }
};

export default {
  formatters,
  validators,
  arrayUtils,
  stringUtils,
  storage,
  urlUtils,
  timing,
  colorUtils,
  fileUtils,
  constants
};
