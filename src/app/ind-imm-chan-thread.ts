import { IndImmChanPostModel } from './ind-imm-chan-post-model';

export class IndImmChanThread {
    IndImmChanPostModelParent: IndImmChanPostModel;
    IndImmChanPostModelChildren: IndImmChanPostModel[] = [];
    constructor() {
        this.IndImmChanPostModelChildren = [];
    }
    TotalReplies = 0;
    ImageReplies = 1;
    LastCommentTime: Date = null;

    public Prep() {
        this.orderRepliesDescending();
        this.populateLastCommentTime();
        // this.linkReplies(sanitizer);
    }
    orderRepliesDescending() {
       this.IndImmChanPostModelChildren = this.IndImmChanPostModelChildren.sort(this.compare);
    }

    populateLastCommentTime() {
        if (this.IndImmChanPostModelChildren && this.IndImmChanPostModelChildren.length > 0) {
            this.LastCommentTime = this.IndImmChanPostModelChildren[this.IndImmChanPostModelChildren.length-1].Timestamp;
        } else {
            this.LastCommentTime = this.IndImmChanPostModelParent.Timestamp
        }
    }

    /*
    linkReplies(sanitizer: DomSanitizer) {
        const ids: string[] = [];
        ids.push(this.IndImmChanPostModelParent.Tx);
        for (let i = 0; i < this.IndImmChanPostModelChildren.length; i++) {
            ids.push(this.IndImmChanPostModelChildren[i].Tx)
        }

        const testprefix = 'postViewer/b/07CC1C1615962DF87C325A0080B8AED3302A0695CD245014A4CCA74C212F594D';

        for (let i = 0; i < this.IndImmChanPostModelChildren.length; i++) {
            for (let j = 0; j < ids.length; j++) {
                this.IndImmChanPostModelChildren[i].MsgSafeHtml = sanitizer.bypassSecurityTrustHtml(
                    this.IndImmChanPostModelChildren[i].Msg.replace(ids[j],
                  //'<a onClick="window.location.hash=\'#'+ ids[j]  +'\'">' + ids[j] + '</a>')
                   '<div onclick="console.log(\'hai\')">' + ids[j] + '</div>'));
                  // '<a href="' +  testprefix+'/#'+ ids[j]  +'">' + ids[j] + '</a>')

            }
        }
    }
    */
    compare( a: IndImmChanPostModel, b:IndImmChanPostModel ) {
        if ( a.Timestamp < b.Timestamp ){
          return -1;
        }
        if ( a.Timestamp > b.Timestamp ){
          return 1;
        }
        return 0;
      }
}
