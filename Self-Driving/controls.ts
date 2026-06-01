export class Controls {
  /*
    Bugs:
    - Didn't perform listener clean-up
    - Didn't use anonymous functions for the handlers
    - Didn't useref when interacting with react environment
  */
  left: boolean = false;
  right: boolean = false;
  forward: boolean = false;
  backward: boolean = false;

  private handle_key_down = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        this.left = true;
        break;
      case "ArrowRight":
        this.right = true;
        break;
      case "ArrowUp":
        this.forward = true;
        break;
      case "ArrowDown":
        this.backward = true;
        break;
    }

    this.log_state();
  };

  handle_key_up = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        this.left = false;
        break;
      case "ArrowRight":
        this.right = false;
        break;
      case "ArrowUp":
        this.forward = false;
        break;
      case "ArrowDown":
        this.backward = false;
        break;
    }
  };

  add_listeners() {
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", this.handle_key_down);
    window.addEventListener("keyup", this.handle_key_up);
  }

  remove_listeners() {
    if (typeof window === "undefined") return;
    window.removeEventListener("keydown", this.handle_key_down);
    window.removeEventListener("keyup", this.handle_key_up);
  }

  private log_state() {
    console.log(
      "left: ",
      this.left,
      " right: ",
      this.right,
      " forward: ",
      this.forward,
      " backward: ",
      this.backward
    );
  }
}
