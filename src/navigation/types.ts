export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
  ActivateAccount: { token?: string };
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
  ActivateAccount: { token?: string };
};

export type MainTabsParamList = {
  Clinics: undefined;
  Leads: undefined;
  ClinicDetail: undefined;
  ClinicForm: undefined;
  LeadDetail: undefined;
  LeadForm: undefined;
  Profile: undefined;
  QRCodeDialog: { clinicId: string };
  PairingCodeDialog: { clinicId: string };
  WhatsAppSettings: { clinicId: string };
};
