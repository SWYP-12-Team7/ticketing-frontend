import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder, updateFolderName, getFolders, createFolder } from "@/services/api/user";

/**
 * 폴더 삭제 Mutation
 * 
 * @description
 * - DELETE /users/me/folders/{folderId}
 * - 성공 시 관련 쿼리 무효화 (폴더 목록, 찜하기, 취향 데이터)
 * 
 * @returns Mutation result with { mutate, isPending, error }
 * 
 * @example
 * ```tsx
 * const { mutate: deleteFolder, isPending } = useDeleteFolder();
 * 
 * const handleDelete = (folderId: number) => {
 *   if (confirm("정말 삭제하시겠습니까?")) {
 *     deleteFolder(folderId);
 *   }
 * };
 * ```
 */
export function useDeleteFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (folderId: number) => deleteFolder(folderId),
    onSuccess: () => {
      // 폴더 목록 & 찜하기 데이터 리프레시
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["userTaste"] });
    },
    onError: (error) => {
      console.error("폴더 삭제 실패:", error);
    },
  });
}

/**
 * 폴더 이름 수정 Mutation
 * 
 * @description
 * - PUT /users/me/folders/{folderId}
 * - 성공 시 관련 쿼리 무효화 (폴더 목록, 찜하기)
 * 
 * @returns Mutation result with { mutate, isPending, error }
 * 
 * @example
 * ```tsx
 * const { mutate: updateName, isPending } = useUpdateFolderName();
 * 
 * const handleRename = () => {
 *   updateName({ 
 *     folderId: 23, 
 *     folderName: "내가 좋아하는 전시" 
 *   });
 * };
 * ```
 */
export function useUpdateFolderName() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ folderId, folderName }: {
      folderId: number;
      folderName: string;
    }) => updateFolderName(folderId, folderName),
    onSuccess: () => {
      // 폴더 목록 & 찜하기 데이터 리프레시
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("폴더 이름 수정 실패:", error);
    },
  });
}

/**
 * 폴더 목록 조회 Query
 * 
 * @description
 * - GET /users/me/folders
 * - 캐싱: 5분
 * - 자동 리프레시: 포커스 시
 * 
 * @returns Query result with folders array
 * 
 * @example
 * ```tsx
 * const { data: folders, isLoading, error } = useFolders();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error />;
 * 
 * return (
 *   <ul>
 *     {folders?.map(folder => (
 *       <li key={folder.id}>
 *         {folder.name} ({folder.totalCount}개)
 *       </li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분 (구 cacheTime)
  });
}

/**
 * 폴더 생성 Mutation
 * 
 * @description
 * - POST /users/me/folders
 * - 성공 시 관련 쿼리 무효화 (폴더 목록)
 * - 생성된 폴더 정보 반환
 * 
 * @returns Mutation result with { mutate, isPending, error, data }
 * 
 * @example
 * ```tsx
 * const { mutate: createNewFolder, isPending, data } = useCreateFolder();
 * 
 * const handleCreate = () => {
 *   const folderName = prompt("폴더 이름을 입력하세요");
 *   if (folderName) {
 *     createNewFolder(folderName, {
 *       onSuccess: (folder) => {
 *         console.log("생성된 폴더 ID:", folder.id);
 *         console.log("생성된 폴더 이름:", folder.name);
 *       }
 *     });
 *   }
 * };
 * ```
 */
export function useCreateFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (folderName: string) => createFolder(folderName),
    onSuccess: () => {
      // 폴더 목록 리프레시
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("폴더 생성 실패:", error);
    },
  });
}
