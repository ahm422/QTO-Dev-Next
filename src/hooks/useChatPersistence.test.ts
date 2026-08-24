// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useChatPersistence } from "./useChatPersistence";

beforeEach(() => {
  window.localStorage.clear();
});

describe("useChatPersistence", () => {
  it("namespaces storage per variant so public and admin state never collide", () => {
    const { result: pub } = renderHook(() => useChatPersistence("public"));
    const { result: admin } = renderHook(() => useChatPersistence("admin"));

    act(() => pub.current.setOpen(true));
    act(() => admin.current.setUnreadCount(3));

    expect(window.localStorage.getItem("chat:public:state")).toContain('"open":true');
    expect(window.localStorage.getItem("chat:admin:state")).toContain('"unreadCount":3');
    expect(JSON.parse(window.localStorage.getItem("chat:public:state")!).unreadCount).toBe(0);
  });

  it("persists open/unread state across remounts", () => {
    const { result, unmount } = renderHook(() => useChatPersistence("public"));
    act(() => {
      result.current.setOpen(true);
      result.current.setUnreadCount(2);
    });
    unmount();

    const { result: remounted } = renderHook(() => useChatPersistence("public"));
    expect(remounted.current.open).toBe(true);
    expect(remounted.current.unreadCount).toBe(2);
  });

  it("dismisses a greeting once and keeps it dismissed", () => {
    const { result } = renderHook(() => useChatPersistence("public"));
    expect(result.current.dismissedGreetings).toEqual([]);

    act(() => result.current.dismissGreeting("hover-bubble"));
    expect(result.current.dismissedGreetings).toEqual(["hover-bubble"]);

    act(() => result.current.dismissGreeting("hover-bubble"));
    expect(result.current.dismissedGreetings).toEqual(["hover-bubble"]);
  });
});
