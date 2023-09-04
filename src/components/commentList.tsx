import { Comment } from "./comment";

export function CommentList({ comments }) {
  return comments.map((comment) => (
    <div key={comment.id} className={`comment-stack max-w-xl relative`}>
      <Comment {...comment} />
    </div>
  ));
}
