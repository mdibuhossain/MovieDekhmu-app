import { ToastAndroid, View } from "react-native";
import {
  Button,
  Form,
  Input,
  Label,
  ScrollView,
  Spinner,
  YStack,
} from "tamagui";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "../../components/Dropdown";
import { useMemo } from "react";
import {
  setForm,
  setLoading,
  resetMovieForm,
} from "@/redux/slices/formDataSlice";
import { addMovie } from "../../lib/firebaseService";

const Create = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state?.formData);
  const user = useSelector((state) => state?.auth?.user);

  const submitHandler = (e) => {
    e.preventDefault();
    let isValid = true;
    Object.keys(formData?.movie).forEach((key) => {
      if (!formData?.movie[key]) {
        ToastAndroid.show(`Please fill ${key} field`, ToastAndroid.SHORT);
        isValid = false;
      }
    });
    if (!isValid) return;
    dispatch(setLoading(true));
    addMovie({
      ...formData?.movie,
      user: {
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        email: user?.email,
      },
    })
      .then(() => {
        ToastAndroid.show("Movie added successfully", ToastAndroid.SHORT);
        dispatch(resetMovieForm());
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const years = useMemo(
    () =>
      Array.from({ length: 2030 - 1900 + 1 }, (_, i) => (1900 + i).toString()),
    []
  );

  const countries = useMemo(
    () => [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo (Congo-Brazzaville)",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czechia (Czech Republic)",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Holy See",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar (formerly Burma)",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia (formerly Macedonia)",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine State",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States of America",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ],
    []
  );

  return (
    <View className="bg-primary flex-1 items-center px-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Form onSubmit={submitHandler}>
          <YStack>
            <Label color="white">Movie title</Label>
            <Input
              id="title"
              minWidth="100%"
              backgroundColor="transparent"
              color="white"
              value={formData?.movie?.title}
              onChangeText={(e) =>
                dispatch(setForm({ index: "movie", key: "title", value: e }))
              }
            />
          </YStack>
          <View className="flex-row w-full">
            <YStack className="mr-2">
              <Label color="white">Year</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                items={years}
                label="Year"
                name="year"
              />
            </YStack>
            <YStack className="flex-1">
              <Label color="white">Origin</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                items={countries}
                label="Origin"
                name="origin"
                searchable
              />
            </YStack>
          </View>
          <View className="flex-row w-full">
            <YStack className="flex-1 mr-2">
              <Label color="white">Film type</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                items={["Live Action", "Anime", "Animation", "Manga", "Manhwa"]}
                label="Film type"
                name="filmType"
              />
            </YStack>
            <YStack>
              <Label color="white">Type</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                items={["Solo", "Series"]}
                label="Type"
                name="subType"
              />
            </YStack>
          </View>

          <YStack>
            <Label color="white">Review</Label>
            <Dropdown
              color="white"
              backgroundColor="transparent"
              items={[
                "excellent",
                "best",
                "better",
                "good",
                "average",
                "bad",
                "worst",
              ]}
              label="Review"
              name="review"
            />
          </YStack>

          <Form.Trigger asChild disabled={formData?.isLoading} className="my-5">
            <Button
              icon={formData?.isLoading ? () => <Spinner /> : null}
              className="bg-secondary text-white"
            >
              Submit
            </Button>
          </Form.Trigger>
        </Form>
      </ScrollView>
    </View>
  );
};

export default Create;
