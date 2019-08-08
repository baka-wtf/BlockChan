import { Component, OnInit } from '@angular/core';
import {Buffer} from 'buffer';
import { IndImmChanPostService } from '../ind-imm-chan-post.service';
import { map, filter, switchMap } from 'rxjs/operators';
import { IndImmChanPost } from '../ind-imm-chan-post';
import { IndImmChanPostManagerService } from '../ind-imm-chan-post-manager.service';
import { IndImmChanAddressManagerService } from '../ind-imm-chan-address-manager.service';
import { IndImmChanPostModel } from '../ind-imm-chan-post-model';
import { IndImmChanThread } from '../ind-imm-chan-thread';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChunkingUtility } from '../chunking-utility';
import { IndImmConfigService } from '../ind-imm-config.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  AddressManagerService: IndImmChanAddressManagerService;
  IndImmChanPostManagerService: IndImmChanPostManagerService;
  Route: ActivatedRoute
  ToastrService: ToastrService;
  Config: IndImmConfigService

  postTitle = '';
  postMessage = '';
  postBoard  = '';
  posterName = 'Anonymous';
  fileToUpload: File = null;
  resultImage: any = null;
  parentTx = '';
  threads: IndImmChanThread[] = null;
  Router: Router;
  PostLoading = false;
  Posting = false;
  PostingError = false;
  PostingEnabled = true;
  PostingSecondsLeftCounter = 0;
  
  constructor(indImmChanPostManagerService: IndImmChanPostManagerService, indImmChanAddressManagerService: IndImmChanAddressManagerService,
    route: ActivatedRoute, router:Router, toasterService: ToastrService,   config: IndImmConfigService
    ) {
      this.Config = config;
      this.Route = route;
      this.IndImmChanPostManagerService = indImmChanPostManagerService;
      this.AddressManagerService = indImmChanAddressManagerService;
      this.Router = router;
      this.ToastrService = toasterService;
    }
  

  public async blockPosting() {
    this.PostingEnabled = false;
    this.PostingSecondsLeftCounter = 60;
    const cu: ChunkingUtility = new ChunkingUtility();

    for(let i = 0; i < 60; i++) {
      this.PostingSecondsLeftCounter--;
      await cu.sleep(1000);
    }
    this.PostingSecondsLeftCounter = 0;
    this.PostingEnabled = true;
  }

  async refresh() {
    this.PostLoading = true;
    while (!this.IndImmChanPostManagerService.IndImmChanPostService.rippleService.Connected) {
      await this.IndImmChanPostManagerService.IndImmChanPostService.chunkingUtility.sleep(1000);
    }
    const threads = await this.IndImmChanPostManagerService.GetPostsForCatalog(this.AddressManagerService.GetBoardAddress(this.postBoard));
    for (let i = 0; i < threads.length; i++) {
      threads[i].Prep();
    }

    threads.sort(this.compare);
    this.threads = threads;
    this.PostLoading = false;
  }
  
  public handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  async post() {
    if (!this.fileToUpload) {
      this.ToastrService.error('Must include a file.', 'Posting Error');
      return;
    }
    if (this.fileToUpload.size > 4400000) {
      this.ToastrService.error('File must be below 4 Megs', 'Posting Error');
      return;
    }
    if (!(this.fileToUpload.type === 'image/jpeg' ||
      this.fileToUpload.type === 'image/gif' ||
      this.fileToUpload.type === 'image/png')) {
        this.ToastrService.error('File must be of type Jpeg, Gif, or PNG; Webm coming soon', 'Posting Error');
        return;
    }
    if (this.postMessage.length > 420) {
      this.ToastrService.error('Message must be less than 420 characters.', 'Posting Error');
      return;
    }
    if (this.postMessage.length === 0) {
      this.ToastrService.error('Message must not be empty', 'Posting Error');
      return;
    }
    if (this.postTitle.length === 0) {
      this.ToastrService.error('Title must not be empty', 'Posting Error');
      return;
    }
    if (this.postTitle.length> 80) {
      this.ToastrService.error('Title must be less than 80 characters.', 'Posting Error');
      return;
    }

    this.Posting = true;

    try {
      this.blockPosting();
      await this.IndImmChanPostManagerService.post(this.postTitle, this.postMessage, this.posterName, this.fileToUpload, this.postBoard, this.parentTx);
      this.PostingError = false;
      this.refresh();
    } catch (error) {
      console.log(error);
      this.PostingError = true;
      this.PostingEnabled = true;
    }  
    this.Posting = false;
  }
  
  async OpenThread(tx: string){
    this.Router.navigate(['/postViewer/' + this.postBoard + '/' + tx]);

  }
  ngOnInit() {
    this.postBoard = this.Route.snapshot.params['board'];
    this.refresh();
  }

  async ManualOverRideShowImage(post: IndImmChanPostModel) {
    post.ShowFullSizeFile = false;
    await this.IndImmChanPostManagerService.ManualOverRideShowImage(post);
  }


  compare( a: IndImmChanThread, b:IndImmChanThread ) {
    if ( a.LastCommentTime < b.LastCommentTime ){
      return 1;
    }
    if ( a.LastCommentTime > b.LastCommentTime ){
      return -1;
    }
    return 0;
  }
}
