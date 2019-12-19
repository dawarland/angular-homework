import { Component, Input } from '@angular/core';
import { Post } from 'models';
import { PostService, PostSocketService, LoggedUser, MessageParser } from 'services';

/**
 * Affiche les poste
 */
@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent { 
    @Input() post: Post;
    
    constructor(
        private postSocket: PostSocketService, 
        private user: LoggedUser,
        private postService: PostService,
        private parser: MessageParser
    ) {}

    ngOnInit() {
        this.post.content = this.parser.parse(this.post);
        for (const c of this.post.comments) {
            c.content = this.parser.parse(c);
            console.log("comment : " , c);
        }
        
        this.postSocket.onComment( () => this.postService.getAll(this.post.channel.id).then((values)=> {
            console.log("new comment tab : ", values);
            for (const post of values) {
                if(post.id === this.post.id){
                    this.post.comments=post.comments;
                    for (const c of this.post.comments) {
                        c.content = this.parser.parse(c);
                        console.log("comment : " , c);
                    }
                }
            }
        } ) );
    }

    like() {
        this.postService.like(this.post).then(() => this.post.liked=!this.post.liked );
        console.log(this.post.liked);
    }

    onComment(message: string) {
        // TODO envoyer le message
        console.log(message);
        this.postService.comment(this.post, message).then(()=>{
            
            //this.postService.getAll(this.channelId).then((values) => console.log(values));
        });

    }
}
