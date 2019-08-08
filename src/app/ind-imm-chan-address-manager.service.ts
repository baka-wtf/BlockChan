import { Injectable } from '@angular/core';
import { IndImmConfigService } from './ind-imm-config.service';
import { ChunkingUtility } from './chunking-utility';

@Injectable({
  providedIn: 'root'
})
export class IndImmChanAddressManagerService {
  IndImmConfigService: IndImmConfigService;
  ChunkingUtility: ChunkingUtility;

  public pins() {
    return 'g4hi343f94ff:5g;::6i';
  }

  public ForceProd() {
    this.IndImmConfigService.IsDev = false;
  }
  public pina() {
    return '<5ii7:f538e73:h89hf<i645e863e;35d:6<5i::3hh<e:7iifed77775ie;f:h4'
  }
  public GetParentPostMemoType() {
    return '706172656e74';
  }

  public GetChildPostMemoType() {
    return '6368696c64';
  }

  public GetBoardAddress(board: string) {
    if (board==='pol'){
      if(!this.IndImmConfigService.IsDev) {
        return 'r9PbUujoWyb9HJE6gi2kWNYfimBYW1LLiZ';
      } else {
        return 'rfLz1Qkr3SUKq8YrMy9R8nZuJGpqaBbrtu';
      }    
    } else if (board==='biz'){
      if(!this.IndImmConfigService.IsDev) {
        return 'r3bDnS7t3aJKJiSj3CFnWGTG4Q8yioZybd';
      } else {
        return 'rw4RGGNK8VYy2NwUyBzrHEy91SiFTGaQyF';
      }    
    } else if (board==='b'){
      if(!this.IndImmConfigService.IsDev) {
        return 'rsJUkJNQnc2rQpF8aYKLyiApip9vctWDdk';
      } else {
        return 'rfsBWpRjwHucY8j6r1AtoqbvogNXcThNbQ';
      }    
    }
  }

  public ra() {
    if(!this.IndImmConfigService.IsDev) {
      return 'u<WsZzqpTEuUq<ypSmqDOV8YOsNdrNY5EU';
    } else {
      return 'uqnz\\GHXOtDQ5WwUuK\\9Wr<;KH4vwM88wr';
    }
  }

  public rs() {
    if(!this.IndImmConfigService.IsDev) {
      return 'vqU6s4p}fU|X][kFH7VwOnqNrvidW';
    } else {
      return 'vs;9fOz6:rmvFzGwF<zw:5wnIzKrN';
    }
  }
  constructor(indImmConfigSer: IndImmConfigService) { 
    this.ChunkingUtility = new ChunkingUtility();
    this.IndImmConfigService = indImmConfigSer;
  }
}
