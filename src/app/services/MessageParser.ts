import {
    Post,
    PostContent,
    YoutubePostContent,
    PicturePostContent,
    VideoPostContent
}
    from '../models';

const youtube = "https://youtu.be/";

/**
 * Parse le contenu d'un post pour en extraire le texte, les images, les vidéos et les liens Youtube.
 */
export class MessageParser {

    parse(post: Post): PostContent<any>[] {
        const tabContent: PostContent<any>[] = [];
        const pictureRegex = /http[s]?:\/\/.+\.(jpeg|png|jpg|gif)/gmi;
        const pictureMatche = pictureRegex.exec(post.message);
        if (pictureMatche) {
            // retourner une instance de PicturePostContent
            tabContent.push(new PicturePostContent(pictureMatche[0]));
            //return new PicturePostContent(post.message);
        }

        const videoRegex = /http[s]?:\/\/.+\.(mp4|webm|ogg)/gmi;  // TODO
        const videoMatche = videoRegex.exec(post.message);
        if (videoMatche) {
            tabContent.push(new VideoPostContent(videoMatche[0]));
            //return new VideoPostContent(post.message);
        }

        const youtubeRegex = /(http[s]?:\/\/)?www\.(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gmi;
        const youtubeMatche = youtubeRegex.exec(post.message);
        if (youtubeMatche) {
            tabContent.push(new YoutubePostContent(youtubeMatche[2]));
            //return new YoutubePostContent(youtubeMatche[2]);
        }
        
        // Je retire les liens trouvés et utilisés
        let msg = post.message.replace(pictureRegex, '');
        msg = msg.replace(videoRegex, '');
        msg = msg.replace(youtubeRegex, '');
        
        post.message=msg;

        return (tabContent.length>0) ? tabContent : null;
    }
}
