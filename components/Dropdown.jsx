import { useState } from "react";
import { Check, ChevronDown, ChevronUp, SearchX } from "@tamagui/lucide-icons";
import { Adapt, Select, Sheet, YStack, getFontSize, Input } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "@/redux/slices/formDataSlice";

export function Dropdown(props) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state?.formData);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items based on the search query
  const filteredItems = props.items?.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Select
      value={formData["movie"][props.name]}
      onValueChange={(e) =>
        dispatch(setForm({ index: "movie", key: props.name, value: e }))
      }
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger
        width="100%"
        iconAfter={ChevronDown}
        color={props.color}
        backgroundColor={props.backgroundColor}
        focusStyle={{ backgroundColor: "$shadowColor" }}
        focusVisibleStyle={{ backgroundColor: props.backgroundColor }}
      >
        <Select.Value color={props.color} placeholder="Something" />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animation="medium"
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          animation="quick"
          animateOnly={["transform", "opacity"]}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          {/* Search Box */}
          {props.searchable && (
            <YStack
              padding="$2"
              flexDirection="row"
              alignItems="center"
              backgroundColor="$background"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                width="90%"
                borderColor="$borderColor"
                borderWidth={1}
                borderRadius="$4"
                padding="$2"
                className="flex-1"
              />
              {searchQuery && (
                <Pressable
                  className="cursor-pointer ml-2 px-2"
                  onPress={() => setSearchQuery("")}
                >
                  <SearchX size={20} />
                </Pressable>
              )}
            </YStack>
          )}
          <Select.Group>
            <Select.Label>{props.label}</Select.Label>
            {/* Render filtered items */}
            {React.useMemo(
              () =>
                filteredItems?.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item} value={item}>
                      <Select.ItemText>{item?.toUpperCase()}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [filteredItems]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={"$4"}
              pointerEvents="none"
            >
              <ChevronDown size={getFontSize(props.size ?? "$true")} />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
