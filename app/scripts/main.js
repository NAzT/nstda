const Config = {}
const Global = {}

Config.appId = 'nstda'
Config.appKey = 'vE0mqTaYj3ntKHx'
Config.appSecret = 'SzwwjMuQnxu9QqStwvMsIDV9W'
Config.topic = '/gearname/topic1'
Config.alias = 'web1'

console.log(Config)
microgear = Microgear.create({
  key: Config.appKey,
  secret: Config.appSecret,
})

microgear.on('connected', function () {
  console.log('netpie connected')
  microgear.setAlias(Config.alias)
  microgear.subscribe('/gearname/+')
  clearInterval(Global.timer1)
  hideNetpieConnectingIcon()
  $('#incoming-messages').html('connected')
})

microgear.on('present', function (event) {
  console.log(event)
})

microgear.on('absent', function (event) {
  console.log(event)
})

microgear.on('message', function (topic, msg) {
  const $p = $('<p class="title">' + msg + '</p>')
  var dateString = moment().format('h:mm:ss a')
  $('#incoming-messages').html($p)
  $('.message-header-text').text('[' + dateString + '] Message: ' + topic)
})

function hideNetpieConnectingIcon () {
  $('.netpie-connecting').hide()
}

function connect_netpie () {
  const startTime = new Date().getTime()
  Global.startedOn = startTime
  Global.timeoutOn = startTime + (10 * 1000)
  Global.timer1 = setInterval(function () {
    const currentTime = new Date().getTime()
    if (currentTime > Global.timeoutOn) {
      alert(Config.appId + ' is an invalid appId.')
      clearInterval(Global.timer1)
      hideNetpieConnectingIcon()
    }
    else {
      console.log('wating... ', Global.timeoutOn - currentTime)
    }
  }, 100)
  microgear.resettoken(function (err) {
    if (err) {
      console.log('reset token err', err)
    } else {
      microgear.connect(Config.appId)
    }
  })
}

var player_sprite_sheet
var player_walk
var player_stand
var mouse_moved = false
var touch_started = false

function preload () {
  var player_frames = [
    {'name': 'player_walk01', 'frame': {'x': 0, 'y': 0, 'width': 70, 'height': 94}},
    {'name': 'player_walk02', 'frame': {'x': 71, 'y': 0, 'width': 70, 'height': 94}},
    {'name': 'player_walk03', 'frame': {'x': 142, 'y': 0, 'width': 70, 'height': 94}},
    {'name': 'player_walk04', 'frame': {'x': 0, 'y': 95, 'width': 70, 'height': 94}},
    {'name': 'player_walk05', 'frame': {'x': 71, 'y': 95, 'width': 70, 'height': 94}},
    {'name': 'player_walk06', 'frame': {'x': 142, 'y': 95, 'width': 70, 'height': 94}},
    {'name': 'player_walk07', 'frame': {'x': 213, 'y': 0, 'width': 70, 'height': 94}},
    {'name': 'player_walk08', 'frame': {'x': 284, 'y': 0, 'width': 70, 'height': 94}},
    {'name': 'player_walk09', 'frame': {'x': 213, 'y': 95, 'width': 70, 'height': 94}},
    {'name': 'player_walk10', 'frame': {'x': 355, 'y': 0, 'width': 70, 'height': 94}},
    {'name': 'player_walk11', 'frame': {'x': 284, 'y': 95, 'width': 70, 'height': 94}}
  ]

  player_sprite_sheet = loadSpriteSheet('images/player_spritesheet.png', player_frames)
  player_walk = loadAnimation(player_sprite_sheet)

  // An animation with a single frame for standing
  player_stand = loadAnimation(new SpriteSheet('images/player_spritesheet.png',
    [{'name': 'player_stand', 'frame': {'x': 284, 'y': 95, 'width': 70, 'height': 94}}]))

}

function setup () {
  createCanvas(windowWidth, windowHeight)
  player_sprite = createSprite(100, 284, 70, 94)
  player_sprite.addAnimation('walk', player_walk)
  player_sprite.addAnimation('stand', player_stand)
}

function draw () {
  clear()
  background(0)
  var eventX
  if (isTouch()) {
    eventX = touchX
  } else {
    eventX = mouseX
  }
  player_sprite.changeAnimation('walk')
  player_sprite.velocity.x = 2
  player_sprite.mirrorX(-1)
  //if mouse is to the left
  if (eventX < player_sprite.position.x - 10) {
    player_sprite.changeAnimation('walk')
    // flip horizontally

    // move left
    player_sprite.velocity.x = -2
  }
  else if (eventX > player_sprite.position.x + 10) {
    player_sprite.changeAnimation('walk')
    // flip horizontally
    player_sprite.mirrorX(1)
    // move right
    player_sprite.velocity.x = 2
  }
  else {
    player_sprite.changeAnimation('stand')
    //if close to the mouse, don't move
    player_sprite.velocity.x = 0
  }

  //draw the sprite
  drawSprites()
}

function touchStarted () {
  touch_started = true
}

function mouseMoved () {
  mouse_moved = true
}

function isTouch () {
  return touch_started && !mouse_moved
}

