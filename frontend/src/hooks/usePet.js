import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useMe';
import { createPet, getPet } from '../services/pets';

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
    onSuccess: pet => queryClient.setQueryData(petKey(pet.owner_id), pet),
    onError: error => {
      // Another tab may have completed selection in the meantime.
      if (error.response?.status === 409) {
        return queryClient.invalidateQueries({ queryKey: petKey(user?.id) });
      }
    },
  });
}
