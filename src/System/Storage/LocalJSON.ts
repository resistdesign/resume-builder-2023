export type LocalJSON = {
  create: (key: string, value: any) => void;
  read: (key: string) => any;
  update: (key: string, value: any) => void;
  delete: (key: string) => void;
  list: () => any[];
};

export const getLocalJSON = (path: string): LocalJSON => {
  return {
    create: (key: string, value: any) => {
      localStorage.setItem(`${path}/${key}`, JSON.stringify(value));
    },
    read: (key: string) => {
      const value = localStorage.getItem(`${path}/${key}`);
      return value ? JSON.parse(value) : undefined;
    },
    update: (key: string, value: any) => {
      localStorage.setItem(`${path}/${key}`, JSON.stringify(value));
    },
    delete: (key: string) => {
      localStorage.removeItem(`${path}/${key}`);
    },
    list: () => {
      const keys = Object.keys(localStorage);
      return keys
        .map((key) => {
          if (key.indexOf(`${path}/`) === 0) {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : undefined;
          }
        })
        .filter((v) => typeof v !== 'undefined');
    },
  };
};
