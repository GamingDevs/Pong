(function(){
  window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              function(callback){window.setTimeout(callback, 1000 / 60)}
  })();
  let canvas = document.getElementById('canvas')
  let ctx = canvas.getContext('2d')
  let _oldFrame, ball, paddle1, paddle2, score

  window.addEventListener("keydown", (event)=>{
    event.preventDefault()
    event.stopPropagation()
    switch(event.keyCode){
      case 87: paddle1.moveUp = true; break
      case 83: paddle1.moveDown = true; break
      case 38: paddle2.moveUp = true; break
      case 40: paddle2.moveDown = true; break
    }
  }, false)
  window.addEventListener("keyup", (event)=>{
    event.preventDefault()
    event.stopPropagation()
    switch(event.keyCode){
      case 87: paddle1.moveUp = false; break
      case 83: paddle1.moveDown = false; break
      case 38: paddle2.moveUp = false; break
      case 40: paddle2.moveDown = false; break
    }
  }, false)

  class Ball{
    constructor(x, y, speed, radius){
      this.x = x
      this.y = y
      this.dirX = (Math.random() < 0.5)? 1 : -1
      this.dirY = (Math.random() < 0.5)? 1 : -1
      this.speed = speed
      this.r = radius
      this.mr = radius >>1
    }
    collision(paddle){
      if(this.x >= paddle.x && this.x <= (paddle.x + paddle.width)){
        if(this.y >= paddle.y && this.y <= (paddle.y + paddle.height)){
          this.dirX *= -1
          this.speed += 20
          if(paddle.x < (canvas.width>>1)) this.x = paddle.width + this.mr
          else this.x = canvas.width - paddle.width - this.mr
        }
      }
    }
    checkWinConditions(score){
      if((this.x - this.mr) < 0 || (this.x + this.mr) > canvas.width){
        if(this.x < (canvas.width >>1)) score.pointP2()
        else score.pointP1()
        this.x = ((canvas.width + 10)>>1)
        this.y = ((canvas.height + 10)>>1)
        this.dirX = (Math.random() < 0.5)? 1 : -1
        this.dirY = (Math.random() < 0.5)? 1 : -1
        this.speed = 200
      }
    }
    update(dt){
      this.x += this.speed * this.dirX * dt
      this.y += this.speed * this.dirY * dt
      if((this.y - this.mr) < 0){
        this.dirY *= -1
        this.y = this.mr + 1
      }else if((this.y + this.mr) > canvas.height){
        this.dirY *= -1
        this.y = canvas.height - this.mr - 1
      }
    }
    render(){
      ctx.fillStyle = '#ecf0f1'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.closePath()
    }
  }
  class Paddle{
    constructor(x, y, width, height, speed){
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this.speed = speed
      this.move_up = false
      this.move_down = false
    }
    update(dt){
      if(this.move_up) this.y += this.speed * -1 * dt
      else if(this.move_down) this.y += this.speed * dt

      if(this.y < 0) this.y = 0
      else if((this.y + this.height) > canvas.height) this.y = canvas.height - this.height
    }
    render(){
      ctx.fillStyle = '#ecf0f1'
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    set moveUp(val){ this.move_up = val }
    set moveDown(val){ this.move_down =  val }
  }
  class Score{
    constructor(){
      this.p1 = 0
      this.p2 = 0
    }
    pointP1(){ ++this.p1 }
    pointP2(){ ++this.p2 }
    render(){
      ctx.fillStyle = '#ecf0f1'
      ctx.font = '100px serif';
      ctx.fillText(`${this.p1}`, (canvas.width >>2), 75)
      ctx.fillText(`${this.p2}`, ((canvas.width >>1) + 100), 75)
    }
  }

  function gameLoop(){
    requestAnimationFrame(gameLoop)
    let _newFrame = +new Date()
    update((_newFrame - _oldFrame)/1000)
    _oldFrame = _newFrame
    render()
  }
  function update(dt){
    ball.update(dt)
    paddle1.update(dt)
    paddle2.update(dt)
    ball.collision(paddle1)
    ball.collision(paddle2)
    ball.checkWinConditions(score)
  }
  function render(){
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#34495e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo((canvas.width >>1), 0);
    ctx.lineTo((canvas.width >>1), canvas.height);
    ctx.strokeStyle = '#ecf0f1'
    ctx.stroke();

    ball.render()
    paddle1.render()
    paddle2.render()
    score.render()
    ctx.restore()
  }

  window.initGame = function(){
    _oldFrame = +new Date()
    ball = new Ball(((canvas.width + 10)>>1), ((canvas.height + 10)>>1), 200, 10)
    paddle1 = new Paddle(0, (((canvas.height) >>1) - 61), 40, 122, 350)
    paddle2 = new Paddle(600, (((canvas.height) >>1) - 61), 40, 122, 350)
    score = new Score()
    gameLoop()
  }
})()
