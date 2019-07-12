import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateScriptService } from '../../_service/create-script.service';
import * as Noty from 'noty';

@Component({
  selector: 'app-script-create',
  templateUrl: './script-create.component.html',
  styleUrls: ['./script-create.component.sass']
})

export class ScriptCreateComponent implements OnInit {
  public slides: any = [];
  private tid: number;
  private lid: number;
  public tutorialName: any;

  constructor(
    private route: ActivatedRoute,
    public createscriptService: CreateScriptService,
    public router: Router
  ) { }

  // argument:contains the data of the cue and narration which is entered by the user while creating the script
  // what it does:takes the data and make an api call(POST request) so as to save that data to database
  // returns: status==success if data is saved successfully and status=false if data couldn't saved successfully because of some reason 
  public onSaveScript(script: any) {
    if (script['order'] == '') {
      if (script['narration'] != '') {
        this.slides.push(
          {
            id: '',
            cue: '',
            narration: '',
            order: '',
            script: ''
          }
        )
      }
    }
    else {
      for (var i = 0; i < script.length; i++) {
        if (script[i]['cue'] == '' && script[i]['narration'] == '') {
          script.splice(i, 1);
        }
        else {
          script[i]['order'] = i + 1;
        }
      }

      this.createscriptService.postScript(
        this.tid, this.lid,
        {
          "details": script,
          "type": 'form'
        }
      ).subscribe(
        (res) => {
          this.router.navigateByUrl("/view/" + this.tid + "/" + this.lid + "/" + this.tutorialName);
          new Noty({
            type: 'success',
            layout: 'topRight',
            theme: 'metroui',
            closeWith: ['click'],
            text: 'The script is sucessfully created!',
            animation: {
              open: 'animated fadeInRight',
              close: 'animated fadeOutRight'
            },
            timeout: 4000,
            killer: true
          }).show();
        },
        (error) => {
          new Noty({
            type: 'error',
            layout: 'topRight',
            theme: 'metroui',
            closeWith: ['click'],
            text: 'Woops! There seems to be an error.',
            animation: {
              open: 'animated fadeInRight',
              close: 'animated fadeOutRight'
            },
            timeout: 4000,
            killer: true
          }).show();
        }
      );
    }

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tid = +params['tid'];//tid is tutorial id
    });
    this.lid = this.route.snapshot.params['lid']//lid contains the language id
    this.tutorialName = this.route.snapshot.params['tutorialName']//tutorial name contains the tutorial name corresponding to the tutorial id
  }

}