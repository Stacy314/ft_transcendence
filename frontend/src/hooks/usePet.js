import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cat1 from '../assets/Cat1.png';
import cat2 from '../assets/Cat2.png';
import { useCurrentUser } from './useMe';
import { createPet, getPet } from '../services/pets';

export const GOTCHIS = [
  { id: 'cat-1', label: 'Cat 1', image: cat1 },
  { id: 'cat-2', label: 'Cat 2', image: cat2 },
];

const petKey = userId => ['pet', userId];

export function usePet() {
  const { user } = useCurrentUser();
  return useQuery({
    queryKey: petKey(user?.id),
    queryFn: ({ signal }) => getPet(signal),
    enabled: Boolean(user),
  });
}

export function useCreatePet() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPet,
    onSuccess: async pet => {
      const queryKey = petKey(pet.owner_id);
      // An older read may still report that no Gotchi exists.
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.setQueryData(queryKey, pet);
    },
    onError: error => {
      // Another tab may have completed selection in the meantime.
      if (error.response?.status === 409) {
        return queryClient.invalidateQueries({ queryKey: petKey(user?.id) });
      }
    },
  });
}
