import { makeRequest } from "./makeRequest"

export function getPosts(token: string) {
   return makeRequest("/api/posts", {
    headers: {
      'authorization': token
    }
   })
}

