import { api } from './api';

// Rails returns { pet: null } when the account has no Gotchi yet.
export async function getPet(signal) {
  const { data } = await api.get('/pet', { signal });
  return data.pet;
}

export async function createPet({ name, species }) {
  const { data } = await api.post('/pet', { pet: { name, species } });
  return data.pet;
}
