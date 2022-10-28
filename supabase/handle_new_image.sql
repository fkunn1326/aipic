create or replace function handle_new_image() returns trigger AS $$


declare
  tags text[];
  a_tag varchar;
  counter numeric:=0;

begin
  tags := new.tags;
  
  if (array_length(tags) > 0) then
    -- for a_tag in select array_elements_text(tags)
    for a_tag in 1..array_length(tags,1) 
    loop
      if (not exists(select 1 from public.tags where tag = a_tag)) then
          insert into public.tags(tag) values(trim(a_tag));
      end if;
    end loop;
    return new;
    
  else
    return new;
  end if;
end;

$$ language plpgsql;