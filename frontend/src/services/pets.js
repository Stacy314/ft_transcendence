import { api } from './api';

// Turns the server's "seconds left" into a deadline on this browser's clock, so clock skew cannot matter.
export function withCooldownDeadlines(pet) {
  if (!pet) return pet;

  const receivedAt = Date.now();
  const readyAt = {};
  for (const [action, seconds] of Object.entries(pet.cooldowns || {})) {
    readyAt[action] = receivedAt + seconds * 1000;
  }
  return { ...pet, ready_at: readyAt };
}

export async function getPet(signal) {
  const { data } = await api.get('/pet', { signal });
  return withCooldownDeadlines(data.pet);
}

export async function createPet({ name, species }) {
  const { data } = await api.post('/pet', { pet: { name, species } });
  return withCooldownDeadlines(data.pet);
}

async function performPetAction(action) {
  const { data } = await api.patch(`/pet/${action}`);
  return withCooldownDeadlines(data.pet);
}

export const feedPet = () => performPetAction('feed');
export const playWithPet = () => performPetAction('play');
export const cleanPet = () => performPetAction('clean');
