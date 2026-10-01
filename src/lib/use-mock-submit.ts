"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MockApiResult, SubmitState } from "@/types";

/** Mock API 호출의 idle/loading/success/error 상태를 관리한다. 언마운트 후에는 상태를 갱신하지 않는다. */
export function useMockSubmit<T>(submit: (input: T) => Promise<MockApiResult>) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const mounted = useRef(true);
  const inFlight = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (input: T) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setState({ status: "loading" });
      try {
        const result = await submit(input);
        if (!mounted.current) return;
        setState(
          result.success
            ? { status: "success", receiptNo: result.receiptNo, message: result.message }
            : { status: "error", message: result.message },
        );
      } finally {
        inFlight.current = false;
      }
    },
    [submit],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, run, reset };
}
