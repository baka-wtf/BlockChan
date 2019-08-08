import { IndImmChanPost } from './ind-imm-chan-post';
import { SafeHtml } from '@angular/platform-browser';

export class IndImmChanPostModel extends IndImmChanPost{
    Timestamp: Date;
    Image: Blob;
    HasImage: boolean;
    Base64Image: any;
    Tx: string;
    IsOrganized = false;
    ShowFullSizeFile = false;
    MsgSafeHtml: SafeHtml;
    public CreateImageFromBlob() {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          this.Base64Image = reader.result;
        }, false);
        if (this.Image) {
          reader.readAsDataURL(this.Image);
        }
      }
}
