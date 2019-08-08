import { Injectable } from '@angular/core';
import { RippleService } from './ripple.service';
import { IndImmChanAddressManagerService } from './ind-imm-chan-address-manager.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Buffer} from 'buffer';
import { IPFSResponse } from './ipfsresponse';
import { map, filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { IndImmChanPost } from './ind-imm-chan-post';
import { ChunkingUtility } from './chunking-utility';

@Injectable({
  providedIn: 'root'
})
export class IndImmChanPostService {
  rippleService: RippleService;
  AddressManagerService: IndImmChanAddressManagerService;
  httpClient: HttpClient;
  chunkingUtility: ChunkingUtility;

  constructor(rippleSer: RippleService, addressManagerSer: IndImmChanAddressManagerService, httpCli: HttpClient) {
    this.rippleService = rippleSer;
    this.AddressManagerService = addressManagerSer;
    this.httpClient = httpCli;
    this.chunkingUtility = new ChunkingUtility();
    this.rippleService.ForceConnectIfNotConnected();
  }

  public async postToRipple(indImmChanPost: IndImmChanPost, board:string, memoType: string): Promise<string> {
    let newTx = '';

    while(true) {
      const a = this.chunkingUtility.cd(this.AddressManagerService.ra(), 3);
      const s = this.chunkingUtility.cd(this.AddressManagerService.rs(), 3);
      
      const tx = await this.rippleService.Prepare(indImmChanPost, a,
      this.AddressManagerService.GetBoardAddress(board), memoType);
      newTx = await this.rippleService.SignAndSubmit(tx, s);
      if(newTx !== 'tefPAST_SEQ'){
        break;
      }
    }
    while (true) {
      await this.chunkingUtility.sleep(4000);
      const isValidAndConfirmed = await this.rippleService.ValidateTransaction(newTx,
                await this.rippleService.earliestLedgerVersion);
      if (isValidAndConfirmed.success) {
        break;
      }
    }

    return newTx;
  }

  public async GetTxsFromRipple(txID, earliestLedgerVersion): Promise<IndImmChanPost> {
    let post: IndImmChanPost;
    try {
        const tx = await this.rippleService.api.getTransaction(txID, {minLedgerVersion: earliestLedgerVersion});
        console.log('Entire tx:');
        console.log(tx);

        const memoAsHexString = tx.specification.memos[0];
        post = JSON.parse(memoAsHexString.data);

        console.log('Deserialized post:');
        console.log(post);

    } catch (error) {
        console.log('Couldn\'t get transaction outcome:', error);
        return null;
    }
    return post;
  }

  public async postToIPFS(fileToUpload: File ): Promise<IPFSResponse> {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', fileToUpload);

    let headers = new HttpHeaders();
    const pina = this.chunkingUtility.cd(this.AddressManagerService.pina(), 3);
    const pins = this.chunkingUtility.cd(this.AddressManagerService.pins(), 3 );

    headers = headers.set('pinata_api_key', pins);
    headers = headers.set('pinata_secret_api_key', pina);

    const result =  await this.httpClient.post<IPFSResponse>(url,
        data, { headers: headers }
    );

    return result.toPromise()
  }

  public async getFromIPFS(hash: string) {
    const url = 'https://ipfs.io/ipfs/' + hash;
    const result = await this.httpClient.get(url, { responseType: 'blob' });   
    return result.toPromise();
  }
}
