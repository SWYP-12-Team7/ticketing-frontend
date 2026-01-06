import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ActiveMap, CategoryKey } from "./domain";
import {
  areActiveMapsEqual,
  parseActiveMapFromQuery,
  serializeActiveMapToQuery,
} from "./domain";

type UseFilterQuerySyncArgs = Readonly<{
  /** query key name (default: "filters") */
  paramKey?: string;
}>;

type UseFilterQuerySyncResult = Readonly<{
  active: ActiveMap;
  toggle: (key: CategoryKey) => void;
  setActive: React.Dispatch<React.SetStateAction<ActiveMap>>;
}>;

/**
 * URL <-> state 동기화
 * - /?filters=exhibition,popup 형태로 공유/새로고침/뒤로가기에서 상태 유지
 */
export function useFilterQuerySync(
  args: UseFilterQuerySyncArgs = {}
): UseFilterQuerySyncResult {
  const paramKey = args.paramKey ?? "filters";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [active, setActive] = React.useState<ActiveMap>(() =>
    parseActiveMapFromQuery(searchParams.get(paramKey))
  );

  // URL -> state (뒤로가기/공유 URL 진입 포함)
  React.useEffect(() => {
    const next = parseActiveMapFromQuery(searchParams.get(paramKey));
    setActive((prev) => (areActiveMapsEqual(prev, next) ? prev : next));
  }, [paramKey, searchParams]);

  // state -> URL (공유/새로고침 유지)
  React.useEffect(() => {
    const nextValue = serializeActiveMapToQuery(active);
    const currValue = searchParams.get(paramKey);

    const isSame =
      (nextValue === null && (currValue === null || currValue === "")) ||
      nextValue === currValue;
    if (isSame) return;

    const sp = new URLSearchParams(searchParams.toString());
    if (nextValue) sp.set(paramKey, nextValue);
    else sp.delete(paramKey);

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [active, paramKey, pathname, router, searchParams]);

  const toggle = React.useCallback((key: CategoryKey) => {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return { active, toggle, setActive };
}


