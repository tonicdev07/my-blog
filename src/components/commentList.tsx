import { Comment } from "./comment";

export function CommentList({ comments }: any) {
  return comments.map((comment: any) => (
    <div key={comment.id} className={`comment-stack max-w-xl relative`}>
      <Comment {...comment} />
    </div>
  ));
}
