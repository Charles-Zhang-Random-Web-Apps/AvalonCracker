let offset = [0, 0, 0]

/////////////// Top Level States ////////////// 
let bShowMemberInspector = false;
let currentShowMemberInspectorIndex = 0;
let groupNames = []
let isGroupMemberTeamGood = []
let teamFormations = []

/////////////// Layout Parameters ////////////// 
const initialGroupMembers = 9;
const buttonBoundarySize = 25;
const groupMemberSizeSliderWidth = 256, groupMemberSizeSliderRightMargin = 80, groupMemberSizeSliderTopMargin = 50;
const groupMemberSizeLabelFontSize = 20, groupMemberSizeLabelRightMargin = groupMemberSizeSliderTopMargin;
const memberInspectorWindowWidth = 300, memberInspectorWindowHeight = 300, memberInspectorWindowTopMargin = 80, memberInspectorWindowRightMargin = 60, memberInspectorWindowPadding = 25, memberInspectorWindowBorderStrokeWeight = 51, memberInspectorWindowBorderStrokeThickness = 2, memberInspectorWindowLabelFontSize = 18;
const inspectorWindowX = document.body.clientWidth - memberInspectorWindowWidth - memberInspectorWindowRightMargin, inspectorWindowY = memberInspectorWindowTopMargin;
const groupSize = () => groupMemberSizeSlider.value()

/////////////// Controls ////////////// 
let groupMemberSizeSlider;
let groupButtons = []
let teamAButton, teamBButton;
let memberNameInput;
let memberChooseTeamButton;
let memberJoinTeamButton;

/////////////// View Routines ////////////// 
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  windowInitialize()
}

function windowInitialize() {
  createGroupMemberSizeSlider();
  populateMemberButtons(groupMemberSizeSlider.value());
  generateProgressButton();
}

function generateProgressButton() {
  const button = createButton(`Next Mission`)
  button.position(50, windowHeight - 70)
  button.style('border-radius', '0%')
  button.mousePressed(() => console.log('test'));
}

function createGroupMemberSizeSlider() {
  groupMemberSizeSlider = createSlider(3, 12, initialGroupMembers, 1);
  groupMemberSizeSlider.position(windowWidth - groupMemberSizeSliderWidth - groupMemberSizeSliderRightMargin, groupMemberSizeSliderTopMargin);
  groupMemberSizeSlider.size(groupMemberSizeSliderWidth);
  groupMemberSizeSlider.changed(() => { populateMemberButtons(groupMemberSizeSlider.value()); hideMemberInspectorWindow();})
}

function populateMemberButtons(count) {

  groupButtons.forEach(g => g.remove())
  groupButtons = [];
  groupNames = [];
  isGroupMemberTeamGood = [];

  for (let index = 0; index < count; index++) {
    const button = createButton(`${index + 1}`)
    groupButtons.push(button)
    groupNames.push(`Member ${index + 1}`)
    isGroupMemberTeamGood.push(true)

    button.position(windowWidth * 0.4 + buttonBoundarySize*index, windowHeight * 0.2)
    button.mousePressed(() => memberButtonPressed(index));
    setGroupMemberTeam(index, true)
  }
}

function setGroupMemberTeam(index, teamA) {
  isGroupMemberTeamGood[index] = teamA
  groupButtons[index].style('background-color', teamA ? 'white' : 'black');
}

function showMemberInspectorWindow(index) {
  bShowMemberInspector = true;
  currentShowMemberInspectorIndex = index;

  teamAButton = createButton('Team Good');
  teamAButton.position(inspectorWindowX + memberInspectorWindowPadding, inspectorWindowY + memberInspectorWindowPadding*2)
  teamAButton.mousePressed(() => setGroupMemberTeam(index, true));
  teamAButton.style('border-radius', '10%')

  teamBButton = createButton('Team Bad');
  teamBButton.position(inspectorWindowX + memberInspectorWindowPadding + teamAButton.size().width + memberInspectorWindowPadding, inspectorWindowY + memberInspectorWindowPadding*2)
  teamBButton.mousePressed(() => setGroupMemberTeam(index, false));
  teamBButton.style('border-radius', '10%')

  memberNameInput = createInput(groupNames[index]);
  memberNameInput.position(inspectorWindowX + memberInspectorWindowPadding, inspectorWindowY + memberInspectorWindowPadding*3);
  memberNameInput.size(100);
  memberNameInput.input(() => groupNames[index] = memberNameInput.value());

  memberChooseTeamButton = createButton('Choose Team');
  memberChooseTeamButton.position(inspectorWindowX + memberInspectorWindowPadding, inspectorWindowY + memberInspectorWindowPadding*7)
  memberChooseTeamButton.style('border-radius', '10%')
  memberChooseTeamButton.mousePressed(() => startChoosingTeam(index));

  memberJoinTeamButton = createButton('Join Team');
  memberJoinTeamButton.position(inspectorWindowX + memberInspectorWindowPadding, inspectorWindowY + memberInspectorWindowPadding*8)
  memberJoinTeamButton.style('border-radius', '10%')
  memberJoinTeamButton.mousePressed(() => memberJoinTeam(index));
}

function hideMemberInspectorWindow() {
  bShowMemberInspector = false;
  teamAButton.remove()
  teamBButton.remove();
}

////////////// Ticking //////////////
function draw() {
  logicTick();
  drawTick();
}

function logicTick() {
  
}

function drawTick() {
  background(128);

  drawTeamFormations();
  drawMembersLabels();
  drawGroupSizeLabel();
  drawMemberInspectorWindow();
}

function drawTeamFormations() {
  const topMargin = 120;
  const x = 80;
  const padding = 20;
  const boundaryWidth = 120;
  const boundaryHeight = 100;

  strokeWeight(1);
  stroke(255);
  teamFormations.forEach((team, t) => {
    fill(0)
    rect(x, topMargin + t * (boundaryHeight + padding), boundaryWidth, boundaryHeight);
    fill(255)
    text(groupNames[team.Leader], x + padding, topMargin + t * (boundaryHeight + padding) + padding);
    team.Members.forEach((member, m) => {
      text(groupNames[member], x + padding, topMargin + t * (boundaryHeight + padding) + padding * (m+3));
    })
  });
  strokeWeight(0);
}

function drawMembersLabels() {
  textSize(groupMemberSizeLabelFontSize);
  fill(0, 102, 153);
  for (let index = 0; index < groupSize(); index++) {
    const name = groupNames[index];
    text(`${index + 1}: ${name}`, 15, 25*index + 70);
  }
}

function drawGroupSizeLabel() {
  textSize(groupMemberSizeLabelFontSize);
  fill(0, 102, 153);
  text(`Group Size: ${groupMemberSizeSlider.value()}`, groupMemberSizeSlider.position().x, groupMemberSizeSlider.position().y - groupMemberSizeSlider.size().height);
}

function drawMemberInspectorWindow() {
  if (bShowMemberInspector) {
    const x = inspectorWindowX;
    const y = inspectorWindowY;

    // Draw background border
    strokeWeight(memberInspectorWindowBorderStrokeThickness);
    stroke(memberInspectorWindowBorderStrokeWeight);
    rect(x, y, memberInspectorWindowWidth, memberInspectorWindowHeight);
    strokeWeight(0);

    // Draw Label
    textSize(memberInspectorWindowLabelFontSize);
    fill(255);
    text(groupNames[currentShowMemberInspectorIndex], x + memberInspectorWindowPadding, y + memberInspectorWindowPadding);
  }
}

////////////// Event Callbacks //////////////
function memberButtonPressed(index) {
  if (bShowMemberInspector && currentShowMemberInspectorIndex == index) hideMemberInspectorWindow()
  else showMemberInspectorWindow(index);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  removeElements();
  windowInitialize();
}

function startChoosingTeam(index) {
  teamFormations.push({
    Leader: index,
    Members: []
  })
}

function memberJoinTeam(index) {
  teamFormations[teamFormations.length - 1].Members.push(index);
}