<script lang="ts">
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav
  } from 'sveltestrap';

  let isOpen = false;

  function handleUpdate(event: CustomEvent<boolean>) {
    isOpen = event.detail;
  }

</script>

<Navbar expand="md" color="primary" dark>
  <NavbarBrand href="/"><img class="logo mr-" src="/dicedornot-logo.svg" alt=""/>Diced or Not</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />

  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ml-auto" navbar>
      <!-- <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>Load Replay</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>Option 1</DropdownItem>
          <DropdownItem>Option 2</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown> -->
    </Nav>
  </Collapse>
</Navbar>
<style>
  .logo {
    width: 2em;
    height: 2em;
  }
</style>
