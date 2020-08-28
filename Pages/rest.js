// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.14.0/js-yaml.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>

import { request } from "https://cdn.pika.dev/@octokit/request";
import { Octokit } from "https://cdn.pika.dev/@octokit/rest";

export function MarkdownToYaml(src){
  const regExp = /```([^)]+)```/gm;
  let matches = regExp.exec(src);
  if(matches != null){ 
    return jsyaml.load(matches[1]);
  }else{
    return null;
  }
}

export class GithubREST {

  constructor(token) {
    if(token != null){
      this.octokit = new Octokit();
    }else{
      this.octokit = new Octokit({
        auth: token
      });
    }
  }
  
  async myAsyncMethod() {
    const result = await request({
      method: "GET",
    });
    console.log(result.data);
  }
  
  async getYamlContent(owner, repo, path){
    return octokit.repos.getContent({
      owner: owner, 
      repo: repo,
      path: path
    }).then(result => {
      let content = buffer.Buffer.from(result.data.content, 'base64').toString();
      return jsyaml.load(content);
    }, e =>{
      return null;
    });
  }
  
  
  
}
