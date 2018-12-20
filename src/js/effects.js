function attachSparckles(container){
    const emitter = new PIXI.particles.Emitter(container, [PIXI.Texture.fromImage("./assets/empty.png")], SPARKLES_JSON);
    let elapsed = Date.now();
    const updt = () => {
        requestAnimationFrame(updt);
        const now = Date.now();
        emitter.update((now - elapsed) * 0.003);
        elapsed = now;
    };

    emitter.emit = true;

    updt();
}