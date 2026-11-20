import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useMe';
import { createPet, getPet, feedPet, playWithPet, cleanPet } from '../services/pets';

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

// Shared plumbing for the feed/play/clean buttons: each just replenishes one
// stat on the server and writes the returned pet back into the query cache.
// While the action is still on cooldown (429) the UI keeps the stale pet and
// relies on its own cooldown countdown, so there is nothing to patch up here.
function usePetAction(mutationFn) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: pet => queryClient.setQueryData(petKey(user?.id), pet),
  });
}

export const useFeedPet = () => usePetAction(feedPet);
export const usePlayWithPet = () => usePetAction(playWithPet);
export const useCleanPet = () => usePetAction(cleanPet);
