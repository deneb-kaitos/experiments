<script>
  import SendIcon from './icons/SendIcon.svelte';
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    flex: 1 0 100%;
    justify-content: center;
    align-items: center;
    background-color: hsl(0deg 0% 86%);
  }

  form {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 3fr 1fr;
    grid-gap: min(1vw, 1vh);

    padding: min(1vw, 1vh) max(1vw, 1.5vh);

    background-color: hsl(0deg 0% 100% / 85%);
    filter: drop-shadow(0px 0px 15px hsl(0deg 0% 66%));
    width: 20vw;
  }

  label {
    align-items: center;
    display: flex;
    font-size: 2.5rem;
    font-variant: small-caps;
    font-weight: 300;
    justify-content: center;
    text-transform: uppercase;
    color: hsl(0, 0%, 60%);
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .row:last-of-type {
    margin: 1vh 0;
  }

  .message,
  .submit {
    pointer-events: all;
  }

  .message {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    user-select: all;
    resize: none;

    background-color: hsl(0deg 0% 90% / 75%);
    font-size: 1.5rem;
  }

  .submit {
    align-self: center;
    background-color: hsl(219, 79%, 66%);
    color: hsl(0, 0%, 100%);
    cursor: pointer;
    font-size: 1.75rem;
    font-variant: small-caps;
    font-weight: 300;
    line-height: 3vh;
    margin: 0;
    padding: 0.75vh;
    text-transform: lowercase;
    width: 5vw;
    border: 1px solid transparent;
  }

  .submit:active,
  .submit:focus {
    background-color: hsl(0deg 74% 50%);
    box-shadow: inset 0px 0px 10px 10px hsl(0deg 74% 46%);
    border: 1px solid hsl(0deg 74% 16%);
  }
</style>

<main>
  <form id='web-push-experiment-form'>
    <label for='web-push-experiment-form'>Web Push Experiment</label>
    <div class='row'>
      <textarea
        class='message'
        cols='auto'
        maxlength='1024'
        name='message'
        required
        rows='10'
        type='text'
      ></textarea>
    </div>
    <div class='row'>
      <button type='submit' class='submit'><SendIcon /></button>
    </div>
  </form>
</main>
