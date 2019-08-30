import express from 'express';

import { SERVER_PORT } from "../Global/enviroment";

export default class Server {
    
    private App:express.Application
    private Port:Number

    constructor(){
        this.App = express()
        this.Port = SERVER_PORT
    }

    public constantes (){
        return {
                  App:this.App,
                  Port:this.Port
                }
    }


    start(callback:Function){
        this.App.listen(this.Port,callback())
    }
}