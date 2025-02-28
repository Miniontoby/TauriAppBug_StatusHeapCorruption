<script lang="ts">
  import { onMount } from 'svelte';
  import { Menu, MenuItem } from '@tauri-apps/api/menu';

	onMount(async () => {
    const menu = await Menu.new({
      items: [
        {
          id: 'Help',
          text: 'Help',
          items: [
            { id: 'HelpHelp', text: 'Help' },
            { id: 'HelpAbout', text: 'About...' },
          ]
        },
      ],
    });
    await menu.setAsAppMenu();
    
    const items = await menu.items();
    for (let i = 0; i < items.length; i++){
      const me = items[i];
      if ('items' in me && !(me instanceof MenuItem)) {
        const iit = (await me.items?.()) ?? [];
        for (const ii of iit) {
          if (!ii.id) continue;
          
          console.log(ii.id, ii)
          // break; // TODO COMMENT THIS LINE TO GET A CRASH!!!!
          console.log(await ii?.text?.())
        }
      }
    }
	});
</script>
Hello world