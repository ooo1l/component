// Timeline 时间线; Animation

/*
 * let animation1 = new Animation(object, property, start, end, duration, delay, timingFunction)
 * let animation2 = new Animation(object, property, start, end, duration, delay, timingFunction)
 * 
 * let timeline = new Timeline
 * timeline.add(animation1)
 * timeline.add(animation2)
 * 
 * timeline.start()
 * timeline.pause()
 * timeline.resume()
 * timeline.stop()
 * 
 * js属性动画
 * css动画很难去实现暂停的功能，js动画可以通过requestAnimationFrame 和 cancelAnimationFrame去实现
 */

export class Timeline {
  constructor () {
    this.animations = []
    this.requestId = null
    this.state = 'init'  // 需要有一个状态管理
    this.tick = () => {
    // 每一帧
      let t = Date.now() - this.startTime
      // console.log(t)
      let animations = this.animations.filter(animation => !animation.finished)
      for(let animation of this.animations) {

        let {object, property, template, start, end, duration, delay, addTime, timingFunction} = animation 

        let progression = timingFunction((t - delay - addTime) / duration); // 0 - 1整数
        
        if (t > duration + delay + addTime) {
          progression = 1;
          animation.finished = true;
        }

        let value = animation.valueFromProgression(progression) // value 就是根据progression 算出当前的值

        object[property] = template(value)
      }
      if(animations.length) {
        this.requestId = requestAnimationFrame(this.tick);
      }
    }
  }

  pause() {
    if (this.state !== 'playing') {
      return
    }
    this.state = "paused"
    this.pauseTime = Date.now()
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
    }
  }

  resume() {
    if (this.state !== "paused") {
      return;
    }
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }

  start () {
    if (this.state !== "init") {
      return;
    }
    this.state = "playing";
    this.startTime = Date.now()
    this.tick()
  }

  restart () {
    if(this.state === 'playing') {
      this.pause()
    }
    this.animations = []
    this.requestId = null
    this.state = 'playing'
    this.startTime = Date.now()
    this.pauseTime = null
    this.tick()
  }

  add(animation, addTime) {
    this.animations.push(animation)
    animation.finished = false
    if (this.state === 'playing') {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0;
    }
  }
}

export class Animation {
  constructor(config) {
      this.object = config.object
      this.property = config.property;
      this.template = config.template;
      this.start = config.start;
      this.end = config.end;
      this.duration = config.duration;
      this.delay = config.delay;
      // ease linear easeIn easeOut
      this.timingFunction = config.timingFunction;
  }
  valueFromProgression(progression) {
    // 可以添加颜色修改
    return this.start + progression * (this.end - this.start)
  }
}

export class colorAnimation extends Animation {
  constructor (config) {
    super(config)
    this.template = config.template || (v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`)
  }
  valueFromProgression(progression){
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a)
    }
  }
}