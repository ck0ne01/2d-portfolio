import { KaboomCtx } from "kaplay";

export const displayDialogue = (text: string, onDisplayEnd: () => void) => {
  const dialogueUi = document.getElementById("textbox-container")!;
  const diaglogue = document.getElementById("dialogue")!;

  dialogueUi.style.display = "block";

  let index = 0;
  let currentText = "";
  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      diaglogue.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 5);

  const closeBtn = document.getElementById("close")!;

  const onCloseBtn = () => {
    onDisplayEnd();
    dialogueUi.style.display = "none";
    diaglogue.innerHTML = "";
    clearInterval(intervalRef);
    closeBtn.removeEventListener("click", onCloseBtn);
  };

  closeBtn.addEventListener("click", onCloseBtn);
};

export const setCamScale = (k: KaboomCtx) => {
  const reziseFactor = k.width() / k.height();

  if (reziseFactor < 1) {
    k.camScale(k.vec2(1));
    return;
  }

  k.camScale(k.vec2(1.5));
};
