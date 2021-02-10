<script>
  import {
    createEventDispatcher,
  } from 'svelte';
  import AskPermissionsIcon from '../icons/AskPermissionsIcon.svelte';

  const dispatchEvent = createEventDispatcher();

  const handleAskPermissionsButtonClick = () => {
    dispatchEvent('askPermissions', {});
  };
</script>

<style>
  .askForPermissions {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas:
      'askPermissionsText askPermissionsButton'
    ;

    height: 8vh;
    width: 20vw;
    padding: 0 1vw;

    transform: translate(0, -8vh);
    background-color: hsl(75deg 98% 36%);
  }

  .askPermissionsText {
    grid-area: askPermissionsText;
    padding: 1vh 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 1.25rem;
    color: hsl(0deg 0% 96%);
  }

  button {
    grid-area: askPermissionsButton;
    background-color: hsl(39deg 100% 50%);

    animation-name: pulse;
    animation-duration: 1.25s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-fill-mode: none;
    animation-play-state: running;

    pointer-events: all;
  }

  button:active {
    background-color: hsl(33deg 79% 66%);
    box-shadow: inset 0px 0px 10px 10px hsl(33deg 79% 60%);
    border: 1px solid hsl(33deg 79% 36%);
    outline: none;
  }
</style>

<section class='askForPermissions roundedCorners'>
  <div class='askPermissionsText'><slot></slot></div>
  <button
    type='button'
    on:click|preventDefault|stopPropagation={handleAskPermissionsButtonClick}
  >
    <AskPermissionsIcon />
  </button>
</section>