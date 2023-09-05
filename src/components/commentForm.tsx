"use client";

import { useState } from "react";

export function CommentForm({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = "",
}: {
  loading: any;
  error: any;
  onSubmit: any;
  autoFocus?: boolean | undefined;
  initialValue?: string | undefined;
}) {
  const [message, setMessage] = useState(initialValue);

  function handleSubmit(e: any) {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(""));
  }

  return (
    <div className=" max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="comment-form-row  ">
          <textarea
            autoFocus={autoFocus}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="message-input bg-[#eae9e9] dark:bg-[#524b4b] "
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Loading" : "Post"}
          </button>
        </div>
        <div className="error-msg">{error}</div>
      </form>
    </div>
  );
}
