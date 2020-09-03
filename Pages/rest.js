// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.14.0/js-yaml.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>

import { request } from "https://cdn.skypack.dev/@octokit/request";
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

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
    this.changeAuth(token);
  }
  
  changeAuth(token) {
    if(token != null){
      this.octokit = new Octokit();
    }else{
      this.octokit = new Octokit({
        auth: token
      });
    }
  }

  async asyncRequest() {
    const result = await request({
      method: "GET",
    });
    console.log(result.data);
  }
  
  async asyncGetContent(owner, repo, path){
    return this.octokit.repos.getContent({
      owner: owner, 
      repo: repo,
      path: path
    }).then(result => {
      return buffer.Buffer.from(result.data.content, 'base64').toString();
    }, e =>{
      return null;
    });
  }

  async asyncGetContentToYaml(owner, repo, path){
    let dst = await this.asyncGetContent(owner, repo, path);
    if(dst == null){
      return null;
    }
    else{
      return jsyaml.load(dst);
    }
  }

}
