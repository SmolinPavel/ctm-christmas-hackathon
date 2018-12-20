function attachSparckles(container){
    var emitter = new PIXI.particles.Emitter(container, [PIXI.Texture.fromImage("./assets/empty.png")], SPARKLES_JSON);
    var elapsed = Date.now();
    var updt = function(){
        requestAnimationFrame(updt);

        var now = Date.now();
        emitter.update((now - elapsed) * 0.001);
        elapsed = now;
    };

    emitter.emit = true;

    updt();
}