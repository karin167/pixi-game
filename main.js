// cards-scene.js
class CardsScene {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.cards = [];
    this.stack1 = new PIXI.Container();
    this.stack2 = new PIXI.Container();
    this.container.addChild(this.stack1, this.stack2);
    this.currentCard = null;
    this.elapsedTime = 0;
    this.createCards();
    this.positionStacks();
  }

  createCards() {
    for (let i = 0; i < 144; i++) {
      const card = new PIXI.Graphics();
      card.beginFill(0xffffff);
      card.drawRoundedRect(0, 0, 80, 120, 10);
      card.endFill();
      card.tint = Math.random() * 0xffffff;
      card.position.set(0, i * 0.5);
      this.cards.push(card);
      this.stack1.addChild(card);
    }
  }

  positionStacks() {
    this.stack1.position.set(
      this.app.screen.width / 3,
      this.app.screen.height / 2
    );
    this.stack2.position.set(
      (this.app.screen.width * 2) / 3,
      this.app.screen.height / 2
    );
  }

  update(delta) {
    this.elapsedTime += delta;

    if (this.currentCard) {
      const progress = Math.min(this.elapsedTime / 120, 1); // 2 seconds = 120 frames at 60 fps
      const startPos = this.stack1.position;
      const endPos = this.stack2.position;
      this.currentCard.position.set(
        startPos.x + (endPos.x - startPos.x) * progress,
        startPos.y + (endPos.y - startPos.y) * progress
      );

      if (progress === 1) {
        this.stack2.addChild(this.currentCard);
        this.currentCard.position.set(0, 0);
        this.currentCard = null;
        this.elapsedTime = 0;
      }
    } else if (this.stack1.children.length > 0 && this.elapsedTime >= 60) {
      // 1 second = 60 frames at 60 fps
      this.currentCard = this.stack1.removeChildAt(
        this.stack1.children.length - 1
      );
      this.container.addChild(this.currentCard);
      this.elapsedTime = 0;
    }
  }

  resize(width, height) {
    this.positionStacks();
  }

  destroy() {
    this.cards.forEach((card) => card.destroy());
    this.stack1.destroy();
    this.stack2.destroy();
  }
}

// text-scene.js
class TextScene {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.textContainer = new PIXI.Container();
    this.container.addChild(this.textContainer);
    this.elapsedTime = 0;
    this.generateText();
  }

  generateText() {
    this.textContainer.removeChildren();

    const texts = ["Hello", "World", "Pixi.js", "JavaScript"];
    const emojis = ["😀", "🌍", "💻", "🎮"];

    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 40 + Math.random() * 36,
      fill: 0xffffff,
    });

    let x = 0;
    const y = 0;

    for (let i = 0; i < 5; i++) {
      if (Math.random() < 0.7) {
        const text = new PIXI.Text(
          texts[Math.floor(Math.random() * texts.length)],
          style
        );
        text.position.set(x, y);
        this.textContainer.addChild(text);
        x += text.width + 10;
      } else {
        const emoji = new PIXI.Text(
          emojis[Math.floor(Math.random() * emojis.length)],
          style
        );
        emoji.position.set(x, y);
        this.textContainer.addChild(emoji);
        x += emoji.width + 10;
      }
    }

    this.textContainer.position.set(
      (this.app.screen.width - this.textContainer.width) / 2,
      (this.app.screen.height - this.textContainer.height) / 2
    );
  }

  update(delta) {
    this.elapsedTime += delta;
    if (this.elapsedTime >= 120) {
      // 2 seconds = 120 frames at 60 fps
      this.generateText();
      this.elapsedTime = 0;
    }
  }

  resize(width, height) {
    this.textContainer.position.set(
      (width - this.textContainer.width) / 2,
      (height - this.textContainer.height) / 2
    );
  }

  destroy() {
    this.textContainer.destroy();
  }
}
//ParticlesScene

class ParticlesScene {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.particles = [];
    this.elapsedTime = 0;
    this.createParticles();
  }

  createParticles() {
    const maxParticles = 100;
    for (let i = 0; i < maxParticles; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(0xff0066);
      particle.drawCircle(0, 2, 5);
      particle.endFill();
      particle.x = this.app.screen.width / 2;
      particle.y = this.app.screen.height / 2;
      particle.vx = Math.random() * 2 - 1;
      particle.vy = Math.random() * 2 - 1;
      particle.life = Math.random() * 50 + 50;
      this.particles.push(particle);
      this.container.addChild(particle);
    }
  }

  update(delta) {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.life -= delta;
      if (particle.life <= 0) {
        particle.x = this.app.screen.width / 2;
        particle.y = this.app.screen.height / 2;
        particle.vx = Math.random() * 2 - 1;
        particle.vy = Math.random() * 2 - 1;
        particle.life = Math.random() * 50 + 50;
      }
    }
  }

  resize(width, height) {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.x = width / 2;
      particle.y = height / 2;
    }
  }

  destroy() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].destroy();
    }
    this.container.destroy();
  }
}

// main.js
class Game {
  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xfed9bf,
      resizeTo: window,
    });
    document.body.appendChild(this.app.view);

    this.currentScene = null;
    this.setupFPSCounter();
    this.setupMenu();

    window.addEventListener("resize", this.resize.bind(this));
    this.app.ticker.add(this.update.bind(this));
  }

  setupFPSCounter() {
    this.fpsText = new PIXI.Text("FPS: 0", {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0x8f93be,
    });
    this.fpsText.position.set(20, 20);
    this.app.stage.addChild(this.fpsText);

    this.app.ticker.add(() => {
      this.fpsText.text = `FPS: ${Math.round(this.app.ticker.FPS)}`;
    });
  }

  setupMenu() {
    const menu = new PIXI.Container();
    const buttonStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 25,
      fill: 0x8f93be,
    });

    const createButton = (text, y, onClick) => {
      const button = new PIXI.Text(text, buttonStyle);
      button.position.set(10, y);
      button.interactive = true;
      button.buttonMode = true;
      button.on("pointerdown", onClick);
      return button;
    };

    menu.addChild(
      createButton("Cards", 50, () => this.setScene(new CardsScene(this.app)))
    );
    menu.addChild(
      createButton("Text", 80, () => this.setScene(new TextScene(this.app)))
    );
    menu.addChild(
      createButton("Particles", 110, () =>
        this.setScene(new ParticlesScene(this.app))
      )
    );

    this.app.stage.addChild(menu);
  }

  setScene(scene) {
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene.container);
      this.currentScene.destroy();
    }
    this.currentScene = scene;
    this.app.stage.addChild(scene.container);
  }

  update(delta) {
    if (this.currentScene) {
      this.currentScene.update(delta);
    }
  }

  resize() {
    if (this.currentScene) {
      this.currentScene.resize(this.app.screen.width, this.app.screen.height);
    }
  }
}

// Initialize the game
new Game();
