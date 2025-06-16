// src/types/index.ts

// Data sent to the backend to register a parent
export interface ParentRegisterCredentials {
  parentname: string
  email: string;
  password: string;
}

// Data received from the backend on successful registration
export interface ParentRegisterResponse {
  _id: string;
  parentname: string;
  email: string;
  message: string;
}

// You can add your ParentLogin types here too for centralization
export interface ParentLoginCredentials {
  email: string;
  password: string;
}

export interface ParentLoginResponse {
  user: {
    _id: string;
    name: string;
    type: 'parent';
  };
  token: string;
}

export interface ChildLoginCredentials {
  childname: string;
  password: string;
}

export interface ChildLoginResponse {
  user: {
    _id: string;
    name: string;
    type: 'child';
  };
  token: string;
}