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
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser'
import { ChunkingUtility } from '../chunking-utility';

@Component({
  selector: 'app-ind-imm-chan-post-viewer',
  templateUrl: './ind-imm-chan-post-viewer.component.html',
  styleUrls: ['./ind-imm-chan-post-viewer.component.scss']
})

export class IndImmChanPostViewerComponent implements OnInit {
  AddressManagerService: IndImmChanAddressManagerService;
  IndImmChanPostManagerService: IndImmChanPostManagerService;
  Route: ActivatedRoute;
  Router: Router;
  ToastrService: ToastrService;

  postTitle = '';
  postMessage = '';
  postBoard  = '';
  posterName = 'Anonymous';
  fileToUpload: File = null;
  resultImage: any = null;
  parentTx = '';
  thread: IndImmChanThread = null;
  PostLoading = false;
  Posting = false;
  PostingError = false;
  Sanitizer: DomSanitizer
  PostingEnabled = true;
  PostingSecondsLeftCounter = 0;
  
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

  constructor(indImmChanPostManagerService: IndImmChanPostManagerService, indImmChanAddressManagerService: IndImmChanAddressManagerService,
    route: ActivatedRoute, router: Router, toastrSrvice: ToastrService, sanitizer: DomSanitizer) {
    this.IndImmChanPostManagerService = indImmChanPostManagerService;
    this.AddressManagerService = indImmChanAddressManagerService;
    this.Route = route;
    this.Router = router;
    this.ToastrService = toastrSrvice;
    this.Sanitizer = sanitizer;
    this.PostingEnabled = true;
  }


  public handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  async post() {
    if (this.postMessage.length > 420) {
      this.ToastrService.error('Message must be less than 420 characters.', 'Posting Error');
      return;
    }
    if (this.postMessage.length === 0) {
      this.ToastrService.error('Message is empty', 'Posting Error');
      return;
    }
    if (this.postTitle.length> 80) {
      this.ToastrService.error('Title must be less than 80 characters.', 'Posting Error');
      return;
    }
    if (this.fileToUpload) {
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

  async refresh() {
    this.PostLoading = true;
    while (!this.IndImmChanPostManagerService.IndImmChanPostService.rippleService.Connected) {
      await this.IndImmChanPostManagerService.IndImmChanPostService.chunkingUtility.sleep(1000);
    }
    const threadResult = await this.IndImmChanPostManagerService.GetPostsForPostViewer(this.AddressManagerService.GetBoardAddress(this.postBoard), 
      this.parentTx);
    threadResult.Prep();
    this.thread = threadResult;
    this.PostLoading = false;
  }

  async ToggleFullSizeFile(post: IndImmChanPostModel) {
    post.ShowFullSizeFile = !post.ShowFullSizeFile;
  }

  ngOnInit() {
    const board = this.Route.snapshot.params['board'];
    const id = this.Route.snapshot.params['id'];

    this.postBoard=board;
    this.parentTx=id;
    this.refresh();
  }

  quoteMessage(tx) {
    this.postMessage = '>>' + tx + '\n' + this.postMessage;
  }
  OpenCatalog() {
    this.Router.navigate(['/catalog/' + this.postBoard]);
  }
}
