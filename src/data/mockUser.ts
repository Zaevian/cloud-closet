import type { UserProfile } from '../types';

export const mockUser: UserProfile = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@gmail.com',
  phone: '(850) 555-0142',
  location: 'Tallahassee, FL',
  address: '2847 Mahan Dr, Tallahassee, FL 32308',
  sizeProfile: {
    shirtSize: 'M',
    waist: 32,
    inseam: 32,
    shoeSize: 10,
    dressSize: '6',
  },
  plan: 'beta-40',
  joinedDate: '2026-01-15',
  avatarUrl: 'https://picsum.photos/seed/alex-avatar/200/200',
};
